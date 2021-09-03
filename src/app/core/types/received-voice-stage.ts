export interface MemberVoiceContent {
    timestamp: number;
    data: string;
    hash: string;
}

export interface ReceivedVoiceStage {
    membersVoiceStage: Map<number, MemberVoiceContent>;
}