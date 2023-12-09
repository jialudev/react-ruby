// actionCable.js

import ActionCable from 'actioncable';

const cable = ActionCable.createConsumer('ws://127.0.0.1:3000/cable');

export default cable;
