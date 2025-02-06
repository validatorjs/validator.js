import test from '../testFunctions';

describe('isSIP', () => {
  it('should validate SIP URIs', () => {
    test({
      validator: 'isSIP',
      valid: [
        'sip:john.doe@example.com',
        'sips:alice@secure.com',
        'sip:user@domain.com:5060',
        'sip:user@domain.com;transport=tcp',
        'sips:user@example.com:5060',
        'sips:user@secure.com;transport=tcp',
        'sip:username@domain.com',
        'sip:username@sub.domain.com',
        'sip:alice:password@atlanta.com',
        'sip:username@192.168.1.1',
        'sips:user@192.168.1.1:5061;transport=tls',
        'sip:username@domain.com;user=phone',
        'sip:username@domain.com;method=INVITE',
        'sip:username@domain.com?subject=test',
        'sip:username@domain.com;tag=1234',
        'sips:username@domain.com;secure=true',
        'sip:username@domain.com:5060;lr',
        'sip:username:password@host.com:5060;transport=udp?header=value',
      ],
      invalid: [
        'https://www.example.com',
        'sip:user',
        'sips:@invalid.com',
        'sip:username@-example.com',
        'sip:user@domain.com:abc',
        'sip:user@domain.com;user=phone;tag=',
        'sips:user@domain:5060@otherdomain.com',
        'sip:@',
        'sip:user@.com',
        'sip:user@domain..com',
        'sips:username@domain.com:port',
      ],
    });
  });
});
