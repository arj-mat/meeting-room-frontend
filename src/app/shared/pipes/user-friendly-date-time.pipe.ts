import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe( {
    name: 'userFriendlyDateTime'
} )
export class UserFriendlyDateTimePipe implements PipeTransform {

    transform( value: string | number | Date | moment.Moment ): string {
        let mmnt = moment.utc( value );
        let now = moment().utc( true );

        if ( mmnt.diff( now, "years" ) <= -1 )
            return mmnt.format( "DD/MM/YYYY HH:mm" );
        else if ( mmnt.diff( now, "hours" ) <= -24 )
            return mmnt.format( "DD/MM HH:mm" );
        else if ( mmnt.diff( now, "hours" ) <= -1 )
            return mmnt.format( "HH:mm" );
        else if ( mmnt.diff( now, "seconds" ) >= -30 )
            return "agora";
        else
            return mmnt.from( now );
    }

}
