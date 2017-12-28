import 'source-map-support/register';

import './greenBoxApi';
import './web/server';

import { setSelfId } from './greenBoxApi';

var publicKey = process.env.IDP_ID || 1;

setSelfId(publicKey);
