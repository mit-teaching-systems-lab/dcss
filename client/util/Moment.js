import * as moment from 'moment';
import 'moment-duration-format';

moment.updateLocale('en', {
  calendar: {
    lastDay: '[yesterday at] LT',
    sameDay: '[today at] LT',
    nextDay: '[tomorrow at] LT',
    lastWeek: '[Last] dddd [at] LT',
    nextWeek: 'dddd [at] LT',
    sameElse: 'L'
  }
});

export default moment;
