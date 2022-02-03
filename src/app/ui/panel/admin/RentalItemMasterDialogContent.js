import EditableTextField from 'core/component/EditableTextField';
import React from 'react';
import { DialogContent, DialogTitle, Grid } from '@material-ui/core';

export const RentalItemMasterDialogContent = React.forwardRef(function UserMasterDialogContent(
  props,
  ref
) {
  const { dialogModel, pageContext, handleChangeTarge } = props;
  return (
    <DialogContent ref={ref}>
      <DialogTitle>{`レンタル品 ${pageContext.title} ダイアログ`}</DialogTitle>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <EditableTextField
            id="serialNo"
            label="シリアル番号"
            editable={pageContext.editable}
            fieldValue={dialogModel.target.serialNo}
            disabled={dialogModel.loading}
            onChange={handleChangeTarge}
          />
        </Grid>
        <Grid item xs={12}>
          <EditableTextField
            id="itemName"
            label="レンタル品名"
            editable={pageContext.editable}
            fieldValue={dialogModel.target.itemName}
            disabled={dialogModel.loading}
            onChange={handleChangeTarge}
          />
        </Grid>
      </Grid>
    </DialogContent>
  );
});
