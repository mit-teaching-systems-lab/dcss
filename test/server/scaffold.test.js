const strings = ['teacher', 'moments'];

test('join strings to equal "teacher moments"', () => {
    expect(strings.join(' ')).toBe('teacher moments');
});
