export const pick = (obj: any, paths: any[]): Pick<any, any> => {
    return {
        ...paths.reduce((mem, key) => ({ ...mem, [key]: obj[key] }), {}),
    }
}

export const describeArc = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    radius: number,
    startAngle: number,
    endAngle: number,
) => {
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'

    const d = [
        'M',
        x1,
        y1 - radius,
        'L',
        x1,
        y2 + radius,
        'A',
        radius,
        radius,
        0,
        largeArcFlag,
        0,
        x1 - radius,
        y2,
        'L',
        x2 + radius,
        y2,
    ].join(' ')

    return d
}

export const describeInverseArc = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    radius: number,
    startAngle: number,
    endAngle: number,
) => {
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'

    const d = [
        'M',
        x2 + radius,
        y2,
        'L',
        x1 - radius,
        y2,
        'A',
        radius,
        radius,
        0,
        largeArcFlag,
        0,
        x1,
        y2 - radius,
        'L',
        x1,
        y1 + radius,
    ].join(' ')

    return d
}

export const describeInverseRightArc = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    radius: number,
    startAngle: number,
    endAngle: number,
) => {
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'

    const d = [
        'M',
        x1 - radius,
        y1,
        'L',
        x2 + radius,
        y1,
        'A',
        radius,
        radius,
        0,
        largeArcFlag,
        0,
        x2,
        y1 + radius,
        'L',
        x2,
        y2 + radius,
    ].join(' ')

    return d
}
export const describeInverseLeftArc = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    radius: number,
    startAngle: number,
    endAngle: number,
) => {
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'
    const d = [
        'M',
        x1,
        y1,
        'L',
        x1,
        y2 - radius,
        'A',
        radius,
        radius,
        0,
        largeArcFlag,
        0,
        x1 + radius,
        y2,
        'L',
        x2 - radius,
        y2,
    ].join(' ')

    return d
}

export const drawLine = (x1: number, y1: number, x2: number, y2: number) => {
    const d = ['M', x1, y1, 'L', x2, y2].join(' ')

    return d
}
