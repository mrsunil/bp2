export class ErrorDisplayView {
    catchPhrase: string;
    status: number;
    title: string;
    message: string;
    image: string;

    constructor(status: string) {
        const errorList: { [status: number]: ErrorDisplayView; } = {
            401:
            {
                status: 401,
                catchPhrase: 'Uho...',
                title: 'Unauthorized access',
                message: 'Who gave you that link ? You shouldn\'t be there !',
                image: 'assets/img/Error401.svg',
            },
            403:
            {
                status: 403,
                catchPhrase: 'Uho...',
                title: 'You do not have access to ATLAS V2',
                message: 'For any questions contact the support team atlas-replat-support@ldc.com',
                image: 'assets/img/Error403.svg',
            },
            404:
            {
                status: 404,
                catchPhrase: 'To infinity and beyond !',
                title: 'Page not Found',
                message: 'Unfortunately, this page doesn\'t exist, check you URL.',
                image: 'assets/img/Error404.svg',
            },
            500:
            {
                status: 500,
                catchPhrase: 'Oops !',
                title: 'Technical error',
                message: 'Something went wrong... don\'t worry, it\'s not you, it\'s us.',
                image: 'assets/img/Error500.svg',
            },
        };

        if (status in errorList) {
            return errorList[status];
        }
    }
}
