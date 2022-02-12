import { ApiDtoConverter } from 'app/model/api/ApiDtoConverter';
import { LangUtils } from 'core/utils/LangUtils';
import { LoginDto } from '@extact-io/rms-generated-client-js';

/**
 * WebApi呼び出しに対して以下を行うFacadeクラス
 * ・DtoとModelObjectのプロパティ名にギャップが出た時のギャップの吸収
 * ・DtoとModelObjectのデータ形式の変換
 * ・StatusCodeの変換と例外ハンドリング
 */
 export class AuthenticateApiFacade {
  constructor(authenticateApi, errorHandler) {
    this.authenticateApi = authenticateApi;
    this.errorHandler = errorHandler;
    LangUtils.bindThis(this);
  }
  async authenticate(loginId, password) {
    const loginDto = new LoginDto(loginId, password);
    try {
      const {data, response} = await this.authenticateApi.authenticateWithHttpInfo({
        loginDto,
      });
      return {
        loginUser: ApiDtoConverter.toUserAccountModel(data),
        bearerToken: this.extractBearerToken(response),
      };
    } catch (error) {
      const errorMessage = 'ログインIDまたはパスワードが違います';
      const hadler400_404 = {
        400: () => errorMessage,
        404: () => errorMessage,
      };
      throw this.errorHandler.handleError(error, hadler400_404);
    }
  }
  extractBearerToken(response) {
    const headerValue = response.header?.authorization;
    if (!headerValue || !headerValue.startsWith('Bearer ')) {
      return '';
    }
    return headerValue.substring(7);
  }
}
