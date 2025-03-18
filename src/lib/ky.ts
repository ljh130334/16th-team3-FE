import ky from 'ky';
import Cookies from 'js-cookie';

const REFRESH_ENDPOINT = '/v1/auth/token/refresh';
const UNAUTHORIZED_CODE = 401;

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  hooks: {
    beforeRequest: [
      (request) => {
        const accessToken = Cookies.get('accessToken');
        alert(
          'beforeRequest - Token check: ' +
            (accessToken ? 'exists' : 'missing'),
        );
        if (accessToken) {
          request.headers.set('Authorization', `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        const accessToken = Cookies.get('accessToken');
        alert(
          `afterResponse - Status: ${response.status}, AccessToken: ${accessToken ? 'exists' : 'missing'}`,
        );

        if (response.status === UNAUTHORIZED_CODE || !accessToken) {
          alert('토큰 재발급 시도 시작');
          try {
            const refreshToken = Cookies.get('refreshToken');
            alert('Refresh Token: ' + (refreshToken ? 'exists' : 'missing'));

            const refreshResponse = await ky.post(
              `${process.env.NEXT_PUBLIC_API_URL}${REFRESH_ENDPOINT}`,
              {
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  refreshToken: refreshToken,
                }),
                credentials: 'include',
              },
            );

            alert(`Refresh Response Status: ${refreshResponse.status}`);

            if (refreshResponse.ok) {
              const responseData =
                (await refreshResponse.json()) as TokenResponse;
              alert('토큰 재발급 성공: ' + JSON.stringify(responseData));

              const {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
              } = responseData;

              Cookies.set('accessToken', newAccessToken);
              Cookies.set('refreshToken', newRefreshToken);

              return api(request, options);
            } else {
              alert('토큰 재발급 실패 - Response not OK');
              return response;
            }
          } catch (error) {
            alert('토큰 재발급 에러: ' + JSON.stringify(error));
            console.error('Token refresh error:', error);
            return response;
          }
        }

        if (!response.ok) {
          alert(
            `API 에러 - Status: ${response.status}, StatusText: ${response.statusText}`,
          );
          try {
            const errorBody = await response.clone().json();
            alert('에러 응답 내용: ' + JSON.stringify(errorBody));
          } catch (e) {
            alert('응답 본문 파싱 실패');
          }
        }

        return response;
      },
    ],
  },
});
