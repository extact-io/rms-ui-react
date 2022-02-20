import { ApiDtoConverter } from 'app/model/api/ApiDtoConverter';
import { LangUtils } from 'core/utils/LangUtils';

const defaultDeleteHandlers = {
  404: () =>
    '該当データは既に削除されている可能性があります。再更新してはじめからやり直してください',
  409: () => '他のデータから参照されているため削除ができません',
};

/**
 * WebApi呼び出しに対して以下を行うFacadeクラス
 * ・DtoとModelObjectのプロパティ名にギャップが出た時のギャップの吸収
 * ・DtoとModelObjectのデータ形式の変換
 * ・StatusCodeの変換と例外ハンドリング
 */
 export class AdminApiFacade {
  constructor(adminApi, errorHandler) {
    this.adminApi = adminApi;
    this.errorHandler = errorHandler;
    LangUtils.bindThis(this);
  }
  async findAllRentalItems() {
    try {
      const { data: resourceDtoList } = await this.adminApi.getAllRentalItemsWithHttpInfo();
      return resourceDtoList.map((item) => ApiDtoConverter.toRentalItemModel(item));
    } catch (error) {
      throw this.errorHandler.handleError(error);
    }
  }
  async addRentalItem(addModel) {
    const param = { addRentalItemDto: ApiDtoConverter.toAddRentalItemDto(addModel) };
    try {
      const { data: resourceDto } = await this.adminApi.addRentalItemWithHttpInfo(param);
      return ApiDtoConverter.toRentalItemModel(resourceDto).id;
    } catch (error) {
      const customHandlers = {
        409: () => '既に使われているシリアル番号です。別の番号にしてください',
      };
      throw this.errorHandler.handleError(error, customHandlers);
    }
  }
  async updateRentalItem(updateModel) {
    const param = { rentalItemResourceDto: ApiDtoConverter.toRentalItemResourceDto(updateModel) };
    try {
      const { data: resource } = await this.adminApi.updateRentalItemWithHttpInfo(param);
      return ApiDtoConverter.toRentalItemModel(resource);
    } catch (error) {
      const customHandlers = {
        409: () => '既に使われているシリアル番号です。別の番号にしてください',
      };
      throw this.errorHandler.handleError(error, customHandlers);
    }
  }
  async deleteRentalItem(deleteId) {
    try {
      await this.adminApi.deleteRentalItemWithHttpInfo(deleteId);
    } catch (error) {
      throw this.errorHandler.handleError(error, defaultDeleteHandlers);
    }
  }
  async findAllReservations() {
    try {
      const { data: resourceDtoList } = await this.adminApi.getAllReservationsWithHttpInfo();
      return resourceDtoList.map((reservation) => ApiDtoConverter.toReservationModel(reservation));
    } catch (error) {
      throw this.errorHandler.handleError(error);
    }
  }
  async updateReservation(updateModel) {
    const param = { reservationResourceDto: ApiDtoConverter.toReservationResourceDto(updateModel) };
    try {
      const { data: resource } = await this.adminApi.updateReservationWithHttpInfo(param);
      return ApiDtoConverter.toReservationModel(resource);
    } catch (error) {
      const hadler409 = {
        409: () => '指定の開始終了日時には別の予約が入っているため更新ができませんでした',
      };
      throw this.errorHandler.handleError(error, hadler409);
    }
  }
  async deleteReservation(deleteId) {
    try {
      await this.adminApi.deleteReservationWithHttpInfo(deleteId);
    } catch (error) {
      throw this.errorHandler.handleError(error, defaultDeleteHandlers);
    }
  }
  async findAllUserAccounts() {
    try {
      const { data: resourceDtoList } = await this.adminApi.getAllUserAccountsWithHttpInfo();
      return resourceDtoList.map((user) => ApiDtoConverter.toUserAccountModel(user));
    } catch (error) {
      throw this.errorHandler.handleError(error);
    }
  }
  async addUserAccount(addModel) {
    const param = { addUserAccountDto: ApiDtoConverter.toAddUserAccountDto(addModel) };
    try {
      const { data: resourceDto } = await this.adminApi.addUserAccountWithHttpInfo(param);
      return ApiDtoConverter.toUserAccountModel(resourceDto).id;
    } catch (error) {
      const customHandlers = {
        409: () => '既に使われているログインIDです。別のIDにしてください',
      };
      throw this.errorHandler.handleError(error, customHandlers);
    }
  }
  async updateUserAccount(updateModel) {
    const param = { userAccountResourceDto: ApiDtoConverter.toUserAccountResourceDto(updateModel) };
    try {
      const { data: resource } = await this.adminApi.updateUserAccountWithHttpInfo(param);
      return ApiDtoConverter.toUserAccountModel(resource);
    } catch (error) {
      const customHandlers = {
        409: () => '既に使われているログインIDです。別のIDにしてください',
      };
      throw this.errorHandler.handleError(error, customHandlers);
    }
  }
  async deleteUserAccount(deleteId) {
    try {
      await this.adminApi.deleteUserAccountWithHttpInfo(deleteId);
    } catch (error) {
      throw this.errorHandler.handleError(error, defaultDeleteHandlers);
    }
  }
}
