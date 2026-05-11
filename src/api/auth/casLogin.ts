export interface CasLoginRequestDto {
  ticket: string;
  tokenExpiresIn: number;
}

export type CasLoginResponseDto =
  | {
      status: 'no_account' | 'no_api_key';
      token: string;
      redirectUrl: string | null;
    }
  | {
      status: 'ok';
      token: string;
      redirectUrl: null;
    }
  | {
      status: 'ok';
      token: null;
      redirectUrl: string;
    };
