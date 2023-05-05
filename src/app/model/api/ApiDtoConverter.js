import { UserType } from 'app/model/field/UserType';
import { DateUtils } from 'core/utils/DateUtils';
import {
  AddRentalItemEventDto,
  AddReservationEventDto,
  UserAccountResourceDto,
  RentalItemResourceDto,
  ReservationResourceDto,
  AddUserAccountEventDto,
} from '@extact-io/rms-generated-client-js';

class ApiDtoConverter {
  static toRentalItemModel(rentalItemResourceDto) {
    const model = {};
    Object.keys(rentalItemResourceDto).forEach((propName) => {
      model[propName] = rentalItemResourceDto[propName];
    });
    return model;
  }
  static toReservationModel(reservationResourceDto) {
    const model = {};
    Object.keys(reservationResourceDto).forEach((propName) => {
      switch (propName) {
        case 'startDateTime':
        case 'endDateTime':
          model[propName] = DateUtils.parseDateFromJsonFormat(reservationResourceDto[propName]);
          break;
        default:
          model[propName] = reservationResourceDto[propName];
      }
    });
    return model;
  }
  static toUserAccountModel(userAccountResourceDto) {
    const model = {};
    Object.keys(userAccountResourceDto).forEach((propName) => {
      const propValue = userAccountResourceDto[propName];
      switch (propName) {
        case 'userType':
          model[propName] = UserType.valueOf(propValue);
          break;
        default:
          model[propName] = propValue;
        }
    });
    return model;
  }
  static toAddRentalItemEventDto(rentalItemModel) {
    return AddRentalItemEventDto.constructFromObject(rentalItemModel);
  }
  static toAddReservationEventDto(reservationModel) {
    return ApiDtoConverter.toAnyReservationResourceDto(reservationModel, AddReservationEventDto);
  }
  static toAddUserAccountEventDto(userAccountModel) {
    return AddUserAccountEventDto.constructFromObject(userAccountModel);
  }
  static toRentalItemResourceDto(rentalItemModel) {
    return RentalItemResourceDto.constructFromObject(rentalItemModel);
  }
  static toReservationResourceDto(reservationModel) {
    return ApiDtoConverter.toAnyReservationResourceDto(reservationModel, ReservationResourceDto);
  }
  static toUserAccountResourceDto(userAccountModel) {
    return UserAccountResourceDto.constructFromObject(userAccountModel);
  }
  static toAnyReservationResourceDto(reservationModel, dtoClass) {
    const paramReservation = { ...reservationModel };
    paramReservation.startDateTime = DateUtils.toJsonFormat(reservationModel.startDateTime);
    paramReservation.endDateTime = DateUtils.toJsonFormat(reservationModel.endDateTime);
    paramReservation.rentalItemId = reservationModel.rentalItemDto.id;
    paramReservation.userAccountId = reservationModel.userAccountDto.id;
    return dtoClass.constructFromObject(paramReservation);
  }
}

export { ApiDtoConverter };
