import { ApiDtoConverter } from 'app/model/api/ApiDtoConverter';
import { LangUtils } from 'core/utils/LangUtils';
import { LoginDto } from 'rms-api';

// ApiとModelのプロパティ名にギャップが出た時にギャップを吸収する
// ApiとModelのデータ形式の変換
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
      const hadler404 = {
        404: () => 'ログインIDまたはパスワードが違います',
      };
      throw this.errorHandler.handleError(error, hadler404);
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
