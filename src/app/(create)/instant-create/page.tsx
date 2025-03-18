'use client';

import { createFunnelSteps, useFunnel } from '@use-funnel/browser';
import { InstantTaskInputType, TaskInputType } from '../context';
import useMount from '@/hooks/useMount';
import BackHeader from '@/components/backHeader/BackHeader';
import TaskInput from '../_components/taskInput/TaskInput';
import InstantTaskTypeInput from '../_components/instantTaskTypeInput/InstantTaskTypeInput';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InstantTaskType, TimePickerType } from '@/types/create';
import { api } from '@/lib/ky';
import { useRouter } from 'next/navigation';
import { TaskResponse } from '@/types/task';

type FormState = {
  task?: string;
  deadlineDate?: Date;
  deadlineTime?: TimePickerType;
  taskType?: string;
  moodType?: string;
};

const steps = createFunnelSteps<FormState>()
  .extends('taskForm')
  .extends('taskTypeInput', {
    requiredKeys: ['task', 'deadlineDate', 'deadlineTime'],
  })
  .build();

const InstantTaskCreate = () => {
  const funnel = useFunnel<{
    taskForm: TaskInputType;
    taskTypeInput: InstantTaskInputType;
  }>({
    id: 'task-create-main',
    steps: steps,
    initial: {
      step: 'taskForm',
      context: {
        task: '',
        deadlineDate: undefined,
        deadlineTime: undefined,
        taskType: '',
        moodType: '',
      },
    },
  });

  const router = useRouter();
  const queryClient = useQueryClient();
  const { isMounted } = useMount();

  const { mutate: createScheduledTaskMutation } = useMutation({
    mutationFn: async (data: InstantTaskType): Promise<TaskResponse> => {
      try {
        alert('Step 1: 요청 시작');
        const response = await api.post(`v1/tasks/urgent`, {
          body: JSON.stringify(data),
        });
        alert('Step 2: 응답 수신, JSON 파싱 시작');

        const result = await response.json();
        alert('Step 3: JSON 파싱 완료');

        return result as TaskResponse;
      } catch (err) {
        alert('mutationFn 에러 발생: ' + JSON.stringify(err));
        throw err;
      }
    },
    onSuccess: (data: TaskResponse) => {
      alert('Step 4: 요청 성공, 데이터 처리 시작');
      const personaName = data.persona.name;
      const taskMode = data.persona.taskKeywordsCombination.taskMode.name;
      const taskType = data.persona.taskKeywordsCombination.taskType.name;

      queryClient.invalidateQueries({ queryKey: ['tasks', 'home'] });
      alert('Step 5: 홈 페이지로 리디렉션');
      router.push(
        `/home-page?dialog=success&task=${funnel.context.task}&personaName=${personaName}&taskMode=${taskMode}&taskType=${taskType}`,
      );
    },
    onError: (error) => {
      alert('Step X: onError 호출됨');
      console.error('Error creating instant task:', error);
      alert('에러 상세: ' + JSON.stringify(error));
      if (error.message) {
        alert('에러 메시지: ' + error.message);
      }
    },
  });

  const lastStep =
    funnel.historySteps.length > 1
      ? funnel.historySteps[funnel.historySteps.length - 2].step
      : undefined;

  const handleHistoryBack = () => {
    if (funnel.step === 'taskTypeInput') {
      funnel.history.replace('taskForm', {
        task: funnel.context.task,
        deadlineDate: funnel.context.deadlineDate,
        deadlineTime: funnel.context.deadlineTime,
      });
    } else {
      router.push('/home-page');
    }
  };

  if (!isMounted) return null;

  return (
    <div className="background-primary flex h-full w-full flex-col items-center justify-start overflow-y-auto px-5">
      <BackHeader onClick={handleHistoryBack} />
      <funnel.Render
        taskForm={({ history }) => (
          <TaskInput
            context={funnel.context}
            lastStep={lastStep}
            onNext={({ task, deadlineDate, deadlineTime }) =>
              history.push('taskTypeInput', {
                task: task,
                deadlineDate: deadlineDate,
                deadlineTime: deadlineTime,
              })
            }
          />
        )}
        taskTypeInput={({ context }) => (
          <InstantTaskTypeInput
            context={context}
            onClick={(data) => createScheduledTaskMutation(data)}
          />
        )}
      />
    </div>
  );
};

export default InstantTaskCreate;
