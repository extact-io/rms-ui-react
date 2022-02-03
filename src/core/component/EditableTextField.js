import React, { useState } from 'react';
import {
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { useOverflownTooltip } from './TooltipedText';

const editableComponent = {
  textField: TextField,
};

const useStyles = makeStyles((theme) => ({
  input: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderWidth: (lineWeight) => lineWeight,
      },
    },
  },
  paper: {
    padding: '0px 5px 5px 14px',
  },
  label: {
    fontSize: '12px',
  },
  value: {
    padding: '3px 0 5px',
    borderBottom: `1px solid ${theme.palette.text.disabled}`,
  },
}));

const useShowPassword = (initVal) => {
  const [showPassword, setShowPassword] = useState(initVal);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return [showPassword, handleClickShowPassword];
};

export default function EditableTextField(props) {
  // set default values & define must values.
  // declare with let because "select" is replacing the type variable
  let {
    autoFocus = false,
    color = 'primary',
    editable = false,
    editableType = 'textField',
    error = false,
    wordWrap = false,
    fullWidth = true,
    multiline = false,
    select = false,
    variant = 'outlined',
    lineWeight = 2, // 枠線の太さ
    disabled = false,
    id,
    name,
    label,
    required,
    type,
    value,
    helperText,
    onChange,
    fieldValue,
    ...other
  } = props;

  const classes = useStyles(lineWeight);
  const [showPassword, handleClickShowPassword] = useShowPassword(false);

  // If name is not set, id is set by default
  if (!name) {
    name = id;
  }

  // If fieldValue is set, the derived item is set by default.
  if (fieldValue) {
    if (!required) {
      required = fieldValue.required;
    }
    if (!value) {
      value = fieldValue.value;
    }
    if (!error) {
      error = fieldValue.error;
    }
    if (!helperText) {
      helperText = fieldValue.message;
    }
  }

  // settings for date and time
  if (type === 'date' || type === 'time') {
    const inputLabelProps = other['InputLabelProps'];
    if (!inputLabelProps) {
      other.InputLabelProps = { shrink: true };
    } else {
      inputLabelProps.shrink = true; // add or override to shrink prop
    }
  }

  // Additional settings for password
  if (type === 'password') {
    const VisibilityAdornment = (
      <InputAdornment position="end">
        <IconButton
          onClick={handleClickShowPassword}
          onMouseDown={(event) => event.preventDefault()}
          edge="end"
        >
          {showPassword ? <Visibility /> : <VisibilityOff />}
        </IconButton>
      </InputAdornment>
    );
    const inputProps = other['InputProps'];
    if (!inputProps) {
      other.InputProps = { endAdornment: VisibilityAdornment };
    } else {
      // add or override to endAdornment prop
      inputProps.endAdornment = VisibilityAdornment;
    }
  }

  // Menu generation for select tag
  let children;
  if (type === 'select') {
    type = 'text';
    select = true;
    if (editable) {
      children = other.options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ));
    } else {
      value = other.options.find((option) => option.value === value).label;
    }
  }

  const [tooltip, textRef] = useOverflownTooltip(value);
  const InputComponent = editableComponent[editableType];

  return (
    <React.Fragment>
      {editable ? (
        <InputComponent
          id={id}
          name={name}
          label={label}
          disabled={disabled}
          required={required}
          value={value}
          error={error}
          helperText={helperText}
          onChange={onChange}
          autoFocus={autoFocus}
          color={color}
          fullWidth={fullWidth}
          multiline={multiline}
          select={select}
          variant={variant}
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          className={classes.input}
          {...other}
        >
          {children}
        </InputComponent>
      ) : (
        <Paper elevation={0} className={classes.paper}>
          <Typography className={classes.label} color="textSecondary">
            {label}
          </Typography>
          <Grid container wrap="nowrap">
            {wordWrap ? (
              <Grid item xs>
                <Typography className={classes.value} style={{ wordWrap: 'break-word' }}>
                  {value}
                </Typography>
              </Grid>
            ) : (
              <Grid item xs zeroMinWidth>
                <Tooltip title={tooltip}>
                  <Typography noWrap className={classes.value} ref={textRef}>
                    {type === 'password' ? value.replace(/./g, '*') : value}
                  </Typography>
                </Tooltip>
              </Grid>
            )}
          </Grid>
        </Paper>
      )}
    </React.Fragment>
  );
}
