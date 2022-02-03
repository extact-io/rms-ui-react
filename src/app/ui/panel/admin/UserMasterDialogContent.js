import { UserType } from 'app/model/field/UserType';
import EditableTextField from 'core/component/EditableTextField';
import { ComponentUtils } from 'core/utils/ComponentUtils';
import React from 'react';
import { DialogContent, DialogTitle, Grid } from '@material-ui/core';

export const UserMasterDialogContent = React.forwardRef(function UserMasterDialogContent(
  props,
  ref
) {
  const { dialogModel, pageContext, handleChangeTarge } = props;
  return (
    <DialogContent ref={ref}>
      <DialogTitle>{`ユーザ ${pageContext.title} ダイアログ`}</DialogTitle>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <EditableTextField
            id="loginId"
            label="ログインID"
            editable={pageContext.isAdd()}
            fieldValue={dialogModel.target.loginId}
            onChange={handleChangeTarge}
            disabled={dialogModel.loading}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <EditableTextField
            id="password"
            label="パスワード"
            type="password"
            editable={pageContext.editable}
            fieldValue={dialogModel.target.password}
            onChange={handleChangeTarge}
            disabled={dialogModel.loading}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <EditableTextField
            id="userName"
            label="ユーザ名"
            editable={pageContext.editable}
            fieldValue={dialogModel.target.userName}
            onChange={handleChangeTarge}
            disabled={dialogModel.loading}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <EditableTextField
            id="userType"
            label="権限"
            type="select"
            editable={pageContext.editable}
            fieldValue={dialogModel.target.userType}
            options={UserType.getOptions(pageContext.isAdd())}
            onChange={handleChangeTarge}
            disabled={dialogModel.loading}
          />
        </Grid>
        <Grid item xs={12}>
          <EditableTextField
            id="contact"
            label="連絡先"
            editable={pageContext.editable}
            fieldValue={dialogModel.target.contact}
            onChange={handleChangeTarge}
            disabled={dialogModel.loading}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <EditableTextField
            id="phoneNumber"
            label="電話番号"
            editable={pageContext.editable}
            fieldValue={dialogModel.target.phoneNumber}
            onChange={handleChangeTarge}
            disabled={dialogModel.loading}
          />
        </Grid>
        <ComponentUtils.DummyEmptyGrid />
      </Grid>
    </DialogContent>
  );
});
