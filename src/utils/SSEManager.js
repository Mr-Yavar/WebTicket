import { ServerEventsClient } from "@servicestack/client";
import {SEATMAP_SERVICE_BASE_URL} from "@/config/appConfig.js";
import useUserStore from "@/stores/user.js";

class SSEManager {
    constructor() {
        this.client = null;
    }

    init() {
       const  user = useUserStore();
        this.client = new EventSource(SEATMAP_SERVICE_BASE_URL+"/seatmap-sse-endpoint?cid="+user.ClientId);
    }

    getInstance() {
        return this.client;
    }
}

export default new SSEManager();