import qs from 'querystring';
import fetch from 'node-fetch';

const baseURL = 'http://localhost:30801';

describe('mocker', () => {
	it('should work in simple GET request', async () => {
		expect.assertions(2);
		const d = await fetch(baseURL + '/api/1');
		expect(d.headers.get('X-Foo')).toBe('bar');
		const data = await d.json();
		expect(data).toEqual({msg: 'api res'});
	});

	it('should work with function data', async () => {
		expect.assertions(2);
		const d = await fetch(baseURL + '/api/2?username=paul');
		expect(d.headers.get('X-Foo2')).toBe('bar2');
		const data = await d.json();
		expect(data).toEqual({role: 'admin', name: 'paul'});
	});

	it('should work with mockjs', async () => {
		expect.assertions(4);
		const d = await fetch(baseURL + '/api/3');
		const {list} = await d.json();
		expect(list.length).toBeGreaterThanOrEqual(5);
		expect(list.length).toBeLessThanOrEqual(10);
		expect(list[0]).toHaveProperty('id');
		expect(typeof list[0].id).toBe('number');
	});

	it('should work in simple POST request', async () => {
		expect.assertions(2);
		const d = await fetch(baseURL + '/api/1', {method: 'POST'});
		expect(d.headers.get('X-Foo')).toBe('bar');
		const data = await d.json();
		expect(data).toEqual({msg: 'api res'});
	});

	it('should work with function data in POST request', async () => {
		expect.assertions(2);
		const d = await fetch(baseURL + '/api/2', {
			method: 'POST', 
			body: qs.stringify({username: 'paul'}), 
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});
		expect(d.headers.get('X-Foo2')).toBe('bar2');
		const data = await d.json();
		expect(data).toEqual({role: 'admin', name: 'paul'});
	});
});