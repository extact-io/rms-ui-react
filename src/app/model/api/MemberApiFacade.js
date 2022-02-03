import { ApiDtoConverter } from 'app/model/api/ApiDtoConverter';
import { DateUtils } from 'core/utils/DateUtils';
import { LangUtils } from 'core/utils/LangUtils';

// ApiとModelのプロパティ名にギャップが出た時にギャップを吸収する
// ApiとModelのデータ形式の変換
class MemberApiFacade {
  constructor(memberApi, errorHandler) {
    this.memberApi = memberApi;
    this.errorHandler = errorHandler;
    LangUtils.bindThis(this);
  }
  async findAllRentalItems() {
    try {
      const { data: itemResouces } = await this.memberApi.getAllRentalItemsWithHttpInfo();
      return itemResouces.map((item) => ApiDtoConverter.toRentalItemModel(item));
    } catch (error) {
      throw this.errorHandler.handleError(error);
    }
  }
  async findCanRentedItemAtTerm(from, to) {
    try {
      const { data: itemResouces } = await this.memberApi.findCanRentedItemAtTermWithHttpInfo(
        DateUtils.toJsonFormat(from),
        DateUtils.toJsonFormat(to)
      );
      return itemResouces.map((item) => ApiDtoConverter.toRentalItemModel(item));
    } catch (error) {
      throw this.errorHandler.handleError(error);
    }
  }
  async findCanRentedItemAtNow() {
    return this.findCanRentedItemAtTerm(new Date(), new Date());
  }
  async findReservationByRentalItemId(rentalItemId) {
    try {
      const { data: reservationResources } =
        await this.memberApi.findReservationByRentalItemIdWithHttpInfo(rentalItemId);
      return reservationResources.map((reservation) =>
        ApiDtoConverter.toReservationModel(reservation)
      );
    } catch (error) {
      throw this.errorHandler.handleError(error);
    }
  }
  async findReservationByReserverId(reserverId) {
    try {
      const { data: reservationResources } =
        await this.memberApi.findReservationByReserverIdWithHttpInfo(reserverId);
      return reservationResources.map((reservation) =>
        ApiDtoConverter.toReservationModel(reservation)
      );
    } catch (error) {
      throw this.errorHandler.handleError(error);
    }
  }
  async canRentedItemAtTerm(rentalItemId, from, to) {
    try {
      const { data: okOrNg } = await this.memberApi.canRentedItemAtTermWithHttpInfo(
        rentalItemId,
        DateUtils.toJsonFormat(from),
        DateUtils.toJsonFormat(to)
      );
      return okOrNg;
    } catch (error) {
      throw this.errorHandler.handleError(error);
    }
  }
  async addReservation(addModel) {
    const param = { addReservationDto: ApiDtoConverter.toAddReservationDto(addModel) };
    try {
      const { data: reservationResource } = await this.memberApi.addReservationWithHttpInfo(param);
      return ApiDtoConverter.toReservationModel(reservationResource).id;
    } catch (error) {
      const hadler409 = {
        409: () => '希望の期間に別の予約が入っているため予約ができませんでした',
      };
      throw this.errorHandler.handleError(error, hadler409);
    }
  }
  async cancelReservation(reservationId) {
    try {
      await this.memberApi.cancelReservationWithHttpInfo(reservationId);
    } catch (error) {
      const hadler403 = {
        403: () => '予約者が本人以外の予約はキャンセルできません',
      };
      throw this.errorHandler.handleError(error, hadler403);
    }
  }
}

export { MemberApiFacade };
