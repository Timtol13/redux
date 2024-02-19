import { LOGIN, REGISTRATION } from "../../types";

export function login(login, password){
    return {
        type: LOGIN,
        payload: {'login': login, 'password': password}
    }
}

export function registration(login, password){
    return {
        type: REGISTRATION,
        payload: {'login': login, 'password': password}
    }
}