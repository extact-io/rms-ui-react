import { ApiDtoConverter } from 'app/model/api/ApiDtoConverter';
import { LangUtils } from 'core/utils/LangUtils';

// ApiとModelのプロパティ名にギャップが出た時にギャップを吸収する
// ApiとModelのデータ形式の変換
class CommonApiFacade {
  constructor(commonApi, errorHandler) {
    this.commonApi = commonApi;
    this.errorHandler = errorHandler;
    LangUtils.bindThis(this);
  }
  async getOwnUserProfile() {
    try {
      const { data: userAccountResource } = await this.commonApi.getOwnUserProfileWithHttpInfo();
      return ApiDtoConverter.toUserAccountModel(userAccountResource);
    } catch (error) {
      throw this.errorHandler.handleError(error);
    }
  }
  async updateUserProfile(updateModel) {
    const param = { userAccountResourceDto: ApiDtoConverter.toUserAccountResourceDto(updateModel) };
    try {
      const { data: userAccountResource } = await this.commonApi.updateUserProfileWithHttpInfo(
        param
      );
      return ApiDtoConverter.toUserAccountModel(userAccountResource);
    } catch (error) {
      throw this.errorHandler.handleError(error);
    }
  }
}
export { CommonApiFacade };
