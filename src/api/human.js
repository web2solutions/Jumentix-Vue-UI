const Human =  [
  {
    '_id': {
      'type': 'string',
      'example': '5c78a060c15bca840749e44b'
    },
    'user': {
      'description': 'Assocaciated user ID',
      'type': 'string',
      'example': '5c78a060c15bca840749e44b'
    },
    'userId': {
      'description': 'User ID',
      'type': 'integer',
      'example': 123
    },
    'companyId': {
      'description': 'Agency ID',
      'type': 'integer',
      'example': 123
    },
    'first_name': {
      'description': 'First Name',
      'type': 'string',
      'example': 'Thomas'
    },
    'last_name': {
      'description': 'Last Name',
      'type': 'string',
      'example': 'Issac'
    },
    'email': {
      'description': 'Email Address',
      'type': 'string',
      'format': 'email',
      'example': 'sample@custom.com'
    },
    'address': {
      'type': 'array',
      'items': {
        '$ref': '#/definitions/address'
      },
      'default': []
    },
    'phone': {
      'type': 'array',
      'items': {
        '$ref': '#/definitions/phone'
      },
      'default': []
    },
    'gender': {
      'description': 'Human Gender',
      'type': 'string',
      'enum': ['Male', 'Female'],
      'example': 'Male'
    },
    'photo': {
      'description': 'Profile photo path',
      'type': 'string',
      'example': 'profile-pic.png'
    },
    'organization': {
      'type': 'array',
      'description': 'The associated Organization IDs',
      'items': {
        'type': 'string'
      },
      'example': '5c78a060c15bca840749e44b',
      'default': []
    },
    'spouse': {
      'type': 'array',
      'description': 'The spouse`s associated Human IDs',
      'items': {
        'type': 'string'
      },
      'example': '5c78a060c15bca840749e44b',
      'default': []
    },
    'birth_parent': {
      'type': 'array',
      'description': 'The birth_parent`s associated Human IDs',
      'items': {
        'type': 'string'
      },
      'example': '5c78a060c15bca840749e44b',
      'default': []
    },
    'adoptive_parent': {
      'type': 'array',
      'description': 'The adoptive_parent`s associated Human IDs',
      'items': {
        'type': 'string'
      },
      'example': '5c78a060c15bca840749e44b',
      'default': []
    },
    'birth_child': {
      'type': 'array',
      'description': 'The birth_child`s associated Human IDs',
      'items': {
        'type': 'string'
      },
      'example': '5c78a060c15bca840749e44b',
      'default': []
    },
    'adoptive_child': {
      'type': 'array',
      'description': 'The adoptive_child`s associated Human IDs',
      'items': {
        'type': 'string'
      },
      'example': '5c78a060c15bca840749e44b',
      'default': []
    },
    'professional': {
      'type': 'array',
      'description': 'The professional`s associated Human IDs',
      'items': {
        'type': 'string'
      },
      'example': '5c78a060c15bca840749e44b',
      'default': []
    },
    'client': {
      'type': 'array',
      'description': 'The client`s associated Human IDs',
      'items': {
        'type': 'string'
      },
      'example': '5c78a060c15bca840749e44b',
      'default': []
    },
    'other_people': {
      'type': 'array',
      'description': 'The other_people`s associated Human IDs',
      'items': {
        'type': 'string'
      },
      'example': '5c78a060c15bca840749e44b',
      'default': []
    },
    'programs': {
      'type': 'array',
      'description': 'Associated program array',
      'items': {},
      'default': []
    },
    'cases': {
      'type': 'array',
      'description': 'Associated case array',
      'items': {},
      'default': []
    },
    'groups': {
      'type': 'array',
      'description': 'Associated groups array',
      'items': {},
      'default': []
    }
  }];
