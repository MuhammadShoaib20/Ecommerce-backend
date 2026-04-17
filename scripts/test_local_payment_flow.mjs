const BASE = 'http://localhost:5000/api';

async function post(path, body, token) {
  const opts = { method: 'POST', headers: { 'Content-Type': 'application/json' } };
  if (token) opts.headers.Authorization = `Bearer ${token}`;
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data;
}

async function run() {
  try {
    console.log('Requesting dev token...');
    const dev = await post('/auth/dev-token');
    const token = dev.token;
    console.log('Dev token received');

    console.log('Calling /payment/process-debug to obtain mocked client_secret...');
    const pay = await post('/payment/process-debug', { amount: 9.99 }, token);
    console.log('Payment response:', pay);

    const mockClient = pay.client_secret;

    console.log('Creating an order using mocked payment id...');
    const order = {
      orderItems: [
        {
          product: null,
          name: 'TEST ITEM',
          quantity: 1,
          price: 9.99,
          image: ''
        }
      ],
      shippingInfo: {
        address: '123 Test St',
        city: 'Testville',
        state: 'TS',
        country: 'Testland',
        zipCode: '00000',
        phoneNo: '1234567890'
      },
      paymentInfo: {
        id: mockClient,
        status: 'succeeded'
      },
      itemsPrice: 9.99,
      taxPrice: 0.999,
      shippingPrice: 0,
      totalPrice: 10.989
    };

    const created = await post('/order/new', order, token);
    console.log('Order creation response:', created);
  } catch (err) {
    console.error('Test failed:', err.message);
  }
}

run();
