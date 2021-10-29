import http from "../http"
import { StorageSpaceStats } from "./testType"

export const getStorageSpaceStats = () => {
    return http.get<StorageSpaceStats>("/eams-support/storage/spaceStats")
}
