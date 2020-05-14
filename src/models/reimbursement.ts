export class Reimbursements {
    id: number;
    amount: number;
    submitted: Date;
    resolved: Date;
    description: string;
    author: string;
    resolver: string;
    status: string;
    type: string;
    constructor(id: number, amount: number, submitted: Date, resolved: Date, description: string,
                author: string, resolver: string, status: string, type: string) {
                    this.id = id;
                    this.amount = amount;
                    this.submitted = submitted;
                    this.resolved = resolved;
                    this.description = description;
                    this.author = author;
                    this.resolver = resolver;
                    this.status = status;
                    this.type = type;
                }
}