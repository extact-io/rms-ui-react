import { BearerToken } from 'app/model/BearerToken';
import { AdminApiFacade } from 'app/model/api/AdminApiFacade';
import { AuthenticateApiFacade } from 'app/model/api/AuthenticateApiFacade';
import { CommonApiFacade } from 'app/model/api/CommonApiFacade';
import { ErrorHandler } from 'app/model/api/ErrorHandler';
import { MemberApiFacade } from 'app/model/api/MemberApiFacade';
import { UserType as ModelUserType } from 'app/model/field/UserType';
import { DateUtils } from 'core/utils/DateUtils';
import { AdminApi, ApiClient, AuthenticateApi, CommonApi, MemberApi, UserType } from 'rms-api';

class ApiClientFactory {
  // fields
  authTypeDef = {
    RmsJwtAuth:{ // OpenAPI => @SecurityRequirement(name = "RmsJwtAuth")
      type: 'bearer',
      accessToken() {
        return BearerToken.getInstance()?.token;
      }
    }
  }

  // constructor
  constructor(baseUrl = 'http://localhost:7001') {
    this.apiClient = new ApiClient(baseUrl);
    this.apiClient.authentications = this.authTypeDef;
    this.errorHandler = new ErrorHandler();
  }

  // methods
  getAuthenticateApiFacade() {
    if (!this.authenticateApiFacade) {
      this.authenticateApiFacade = new AuthenticateApiFacade(
        new AuthenticateApi(this.apiClient),
        this.errorHandler
      );
    }
    return this.authenticateApiFacade;
  }
  getMemberApiFacade() {
    if (!this.memberApiFacade) {
      this.memberApiFacade = new MemberApiFacade(new MemberApi(this.apiClient), this.errorHandler);
    }
    return this.memberApiFacade;
  }
  getAdminApiFacade() {
    if (!this.adminApiFacade) {
      this.adminApiFacade = new AdminApiFacade(new AdminApi(this.apiClient), this.errorHandler);
    }
    return this.adminApiFacade;
  }
  getCommonApiFacade() {
    if (!this.commonApiFacade) {
      this.commonApiFacade = new CommonApiFacade(new CommonApi(this.apiClient), this.errorHandler);
    }
    return this.commonApiFacade;
  }
}

// replace ApiClient method.
ApiClient.parseDate = DateUtils.parseDateFromJsonFormat;
UserType.constructFromObject = (userType) => {
  if (userType instanceof ModelUserType) {
    return userType.value;
  }
  return userType; // String
};
ApiClientFactory.instance = new ApiClientFactory();
export { ApiClientFactory };
