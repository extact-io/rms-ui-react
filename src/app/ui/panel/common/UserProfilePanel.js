import { User, useUser } from 'app/model/User';
import { ApiClientFactory } from 'app/model/api/ApiClientFactory';
import { UserType } from 'app/model/field/UserType';
import { SessionContext } from 'app/provider/SessionContextProvider';
import PanelLayout from 'app/ui/panel/PanelLayout';
import EditableTextField from 'core/component/EditableTextField';
import { ValidatableField } from 'core/field/ValidatableField';
import { GlobalContext } from 'core/provider/GlobalContextProvider';
import { ComponentUtils } from 'core/utils/ComponentUtils';
import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

export default function UseProfile() {
  const classes = useStyles();

  const { loginUser, updateLoginUser } = useContext(SessionContext);
  const { backdropState, messageState } = useContext(GlobalContext);

  const [targetUser, changeTargetUser, resetTargetUser, validateAll] = useUser(loginUser);
  const [savedUser, setSavedUser] = useState(() => User.toObject(targetUser));
  const [edit, setEditMode] = useState(false);

  const handleChangeTargeUser = (event) => {
    // id attribute is not passed to event of select, get it with name attribute
    changeTargetUser(event.target.value, event.target.name);
  };
  const handleEditCancel = () => {
    resetTargetUser(User.toFields(savedUser));
    setEditMode(false);
  };
  const handleFixEdit = async () => {
    if (!validateAll()) {
      return;
    }
    const targetUserObject = User.toObject(targetUser);
    const success = await upateUserProfileToServer(targetUserObject);
    if (success) {
      updateLoginUser(targetUserObject);
      setSavedUser(targetUserObject);
      setEditMode(false);
    }
  };
  const upateUserProfileToServer = async (profileObject) => {
    const commonApiFacade = ApiClientFactory.instance.getCommonApiFacade();
    backdropState.start();
    let success = false;
    try {
      await commonApiFacade.updateUserProfile(profileObject);
      messageState.pushMessage(null, '更新しました', 'success');
      success = true;
    } catch (error) {
      messageState.pushMessage(error.code, error.message);
    } finally {
      backdropState.end();
    }
    return success;
  };

  useEffect(() => {
    return () => messageState.clear();
  }, []);

  return (
    <React.Fragment>
      <PanelLayout>
        <Box mb={3}>
          <Typography component="h1" variant="h4" align="center">
            ユーザプロファイル
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <EditableTextField
              id="loginId"
              label="ログインID"
              editable={false}
              value={targetUser.loginId.value}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <EditableTextField
              id="password"
              label="パスワード"
              type="password"
              editable={edit}
              fieldValue={targetUser.password}
              onChange={handleChangeTargeUser}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <EditableTextField
              id="userName"
              label="ユーザ名"
              editable={edit}
              fieldValue={targetUser.userName}
              onChange={handleChangeTargeUser}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <EditableTextField
              id="userType"
              label="権限"
              type="select"
              editable={edit}
              fieldValue={targetUser.userType}
              options={UserType.getOptions()}
              onChange={handleChangeTargeUser}
            />
          </Grid>
          <Grid item xs={12}>
            <EditableTextField
              id="contact"
              label="連絡先"
              editable={edit}
              fieldValue={targetUser.contact}
              onChange={handleChangeTargeUser}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <EditableTextField
              id="phoneNumber"
              label="電話番号"
              editable={edit}
              fieldValue={targetUser.phoneNumber}
              onChange={handleChangeTargeUser}
            />
          </Grid>
          <ComponentUtils.DummyEmptyGrid />
        </Grid>
        <div className={classes.buttons}>
          {edit ? (
            <React.Fragment>
              <Button className={classes.button} onClick={handleEditCancel}>
                CANCEL
              </Button>
              <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                disabled={!ValidatableField.allOk(targetUser)}
                onClick={handleFixEdit}
              >
                確定
              </Button>
            </React.Fragment>
          ) : (
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={() => setEditMode(true)}
            >
              編集
            </Button>
          )}
        </div>
      </PanelLayout>
    </React.Fragment>
  );
}
