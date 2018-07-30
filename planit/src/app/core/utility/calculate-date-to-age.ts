import { Injectable } from '@angular/core';

@Injectable()
export class CalculateAgeFromDate {
    public calculate(date) {
        const diffInMs: number = Date.now() - Date.parse(date);
        const diffInHours: number = diffInMs / 1000 / 60 / 60 / 24 / 365;
        if (diffInHours >= 0) {
            return Math.round(diffInHours);
        }
        return 0;
    }
}
