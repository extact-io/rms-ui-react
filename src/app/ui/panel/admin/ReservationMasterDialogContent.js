import EditableTextField from 'core/component/EditableTextField';
import React from 'react';
import { DialogContent, DialogTitle, Grid } from '@material-ui/core';

export const ReservationMasterDialogContent = React.forwardRef(function UserMasterDialogContent(
  props,
  ref
) {
  const { dialogModel, pageContext, handleChangeTarge } = props;
  const handleDateTimeOnBlur = (event) => {
    dialogModel.revalidateOnDep(event.target.id);
  };
  return (
    <DialogContent ref={ref}>
      <DialogTitle>{`予約 ${pageContext.title} ダイアログ`}</DialogTitle>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <EditableTextField
            id="itemName"
            name="itemName"
            label="レンタル品"
            editable={false}
            value={dialogModel.target.rentalItemDto.itemName}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <EditableTextField
            id="userName"
            name="userName"
            label="予約者"
            editable={false}
            value={dialogModel.target.userAccountDto.userName}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <EditableTextField
            id="startDate"
            label="利用開始日"
            type="date"
            editable={pageContext.editable}
            fieldValue={dialogModel.target.startDate}
            onChange={handleChangeTarge}
            onBlur={handleDateTimeOnBlur}
            disabled={dialogModel.loading}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <EditableTextField
            id="startTime"
            label="利用開始時間"
            type="time"
            editable={pageContext.editable}
            fieldValue={dialogModel.target.startTime}
            onChange={handleChangeTarge}
            onBlur={handleDateTimeOnBlur}
            disabled={dialogModel.loading}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <EditableTextField
            id="endDate"
            label="利用終了日"
            type="date"
            editable={pageContext.editable}
            fieldValue={dialogModel.target.endDate}
            onChange={handleChangeTarge}
            onBlur={handleDateTimeOnBlur}
            disabled={dialogModel.loading}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <EditableTextField
            id="endTime"
            label="利用終了時間"
            type="time"
            editable={pageContext.editable}
            fieldValue={dialogModel.target.endTime}
            onChange={handleChangeTarge}
            onBlur={handleDateTimeOnBlur}
            disabled={dialogModel.loading}
          />
        </Grid>
        <Grid item xs={12}>
          <EditableTextField
            id="note"
            name="note"
            label="備考"
            editable={pageContext.editable}
            multiline
            rows={2}
            wordWrap={false}
            fieldValue={dialogModel.target.note}
            onChange={handleChangeTarge}
            disabled={dialogModel.loading}
          />
        </Grid>
      </Grid>
    </DialogContent>
  );
});
