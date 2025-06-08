import {io} from 'socket.io-client';

const urlBack = process.env.NEXT_PUBLIC_URL_BACK

const socket = io(urlBack);

export default socket;