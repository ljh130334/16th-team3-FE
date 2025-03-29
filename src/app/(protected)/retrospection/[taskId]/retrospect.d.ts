type ResultContent = -1 | 0 | 1 | 2 | 3 | 4;
type FocusContent =  0 | 1 | 2 | 3 | 4 | 5;

type RetrospectContent = {
    result: ResultContent;
    focus: FocusContent;
    keepAndTry?: string;
}

type RetrospectItems = {
    [key: string]: {
      title: string;
      required: boolean;
    };
};
