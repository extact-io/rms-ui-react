import { ItemNameField } from 'app/model/field/ItemNameField';
import { SerialNoField } from 'app/model/field/SerialNoField';

// propNameの隠蔽目的
export class RentalItem {
  static newObject(id, itemName, serialNo) {
    return {
      id: id,
      itemName: itemName,
      serialNo: serialNo,
    };
  }
  static newEmptyObject() {
    return RentalItem.newObject(-1, '', '');
  }
  static toFields(itemObject) {
    return {
      id: itemObject.id,
      itemName: new ItemNameField(itemObject.itemName),
      serialNo: new SerialNoField(itemObject.serialNo),
    };
  }
  static toObject(itemFields) {
    if (!itemFields) {
      return itemFields; // null or undefined
    }
    return {
      id: itemFields.id, // Not ValidatableField Instance.
      itemName: itemFields.itemName.value,
      serialNo: itemFields.serialNo.value,
    };
  }
  static emptyFieldsFactory() {
    return RentalItem.toFields(RentalItem.newEmptyObject());
  }
}
