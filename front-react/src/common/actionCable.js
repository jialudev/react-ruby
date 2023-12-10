// actionCable.js

import ActionCable from 'actioncable';

const cable = ActionCable.createConsumer('ws://139.198.152.63:13000/cable');

export default cable;
