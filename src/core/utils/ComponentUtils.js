import { Grid } from '@material-ui/core';

export class ComponentUtils {
  static isTextOverflown(element) {
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
  }
  static DummyEmptyGrid({ xs = 12, sm = 6, padding = '1px' }) {
    return <Grid item xs={xs} sm={sm} style={{ padding }} />;
  }
}
