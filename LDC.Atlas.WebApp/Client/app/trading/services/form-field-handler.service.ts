/// input has to be of format YYYY or YYYY/YYYY
export function getCropYearValue(cropYearInputString: string): { from: number, to: number } {
    const res: number[] = [];
    const values = cropYearInputString.toString().split('/');
    values.forEach((val) => {
        res.push(+val);
    });

    return { from: res[0], to: (res.length > 1) ? res[1] : null };
}

/// return is of format YYYY or YYYY/YYYY
export function formatCropYearToString(cropYearFrom: string, cropYearTo: string = null): string {
    let res = String(cropYearFrom);
    if (cropYearTo) {
        res += '/' + String(cropYearTo);
    }

    return res;
}
