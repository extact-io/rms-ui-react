import { ApiDtoConverter } from 'app/model/api/ApiDtoConverter';
import { LangUtils } from 'core/utils/LangUtils';

/**
 * WebApi呼び出しに対して以下を行うFacadeクラス
 * ・DtoとModelObjectのプロパティ名にギャップが出た時のギャップの吸収
 * ・DtoとModelObjectのデータ形式の変換
 * ・StatusCodeの変換と例外ハンドリング
 */
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
