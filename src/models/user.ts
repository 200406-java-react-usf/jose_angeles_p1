export class User {
    id: number;
    username: string;
    password: string;
    fn: string;
    ln: string;
    email: string;
    role: string;
    constructor(id: number, username: string, password: string, fn: string, ln: string, email: string, role: string ) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.fn = fn;
        this.ln = ln;
        this.email = email;
        this.role = role;
    }
}