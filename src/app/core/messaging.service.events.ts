interface MessagingServiceEventInfo {
    callback: Function,
    parentInstance: any
}

export enum MessagingEvents {
    OnNewChatMessageReceived,
    OnMemberUpdate,
    OnAudioRecordingSent,
    OnNewMediaReceived,
    OnMediaSyncDataReceived,
    OnMediaSyncDataNotAvailable
}

export class MessagingServiceEvents {
    private events: { [ event: string ]: Array<MessagingServiceEventInfo> | undefined } = {};

    public on( event: MessagingEvents, parentInstance: any, callback: Function ): MessagingServiceEvents {
        if ( event == MessagingEvents.OnNewMediaReceived )
            console.log( "set event ", MessagingEvents[ event ], " instance ", parentInstance.constructor.name );

        ( this.events[ event ] = this.events[ event ] || [] ).push( {
            callback: callback,
            parentInstance: parentInstance
        } );

        return this;
    }

    public fire( event: MessagingEvents, args: Array<any> = [] ) {
        if ( !this.events[ event ] )
            return;

        this.events[ event ]?.forEach( eventInfo => {
            if ( !eventInfo.parentInstance )
                return;

            eventInfo.callback.apply( eventInfo.parentInstance, args );
        } );
    }
}