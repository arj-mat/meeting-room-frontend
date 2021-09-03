export interface RoomMediaSyncAvailabilityRequest {
    requestId: string,
    mediaId: string
}

export interface RoomMediaSyncAvailabilityAnswer {
    requestId: string,
    isAvailable: boolean
}

export interface RoomMediaSyncRequest {
    requestId: string,
    mediaId: string
}

export interface RoomMediaSyncRequestAnswer {
    requestId: string,
    data: string
}

export interface RoomMediaSyncData {
    mediaId: string,
    data: string
}

export interface RoomMediaSyncDataNotAvailable {
    mediaId: string
}