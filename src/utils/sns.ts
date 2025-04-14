import { Inject, Service } from 'typedi'
import { Config } from '../configs'
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns'

@Service()
export class SnsService {
    protected snsClient: SNSClient

    constructor(@Inject() protected config: Config) {
        const { snsConfig } = config
        this.snsClient = new SNSClient({
            region: snsConfig.region,
            credentials: {
                accessKeyId: snsConfig.accessKeyId,
                secretAccessKey: snsConfig.secretAccessKey,
            },
        })
    }

    sendMessage(phoneNumber: string, message: string) {
        const command = new PublishCommand({
            Message: message,
            PhoneNumber: phoneNumber,
            MessageAttributes: {
                'AWS.SNS.SMS.SenderID': {
                    DataType: 'String',
                    StringValue: this.config.snsConfig.sender,
                },
                'AWS.SNS.SMS.SMSType': {
                    DataType: 'String',
                    StringValue: 'Transactional',
                },
            },
        })

        return this.snsClient.send(command)
    }
}
