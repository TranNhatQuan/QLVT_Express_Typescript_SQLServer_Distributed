import { Service } from 'typedi'
import { State } from './entities/state.entity'

@Service()
export class AddressService {
    async getStates() {
        return await State.getStates()
    }
}
