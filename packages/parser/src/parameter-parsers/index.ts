import type { AstCollector, KitaConfig, ParameterParser } from '@kitajs/common';
import type { SchemaBuilder } from '../schema/builder';
import { BodyParameterParser } from './body';
import { BodyPropParameterParser } from './body-prop';
import { ChainParameterParser } from './chain';
import { CookieParameterParser } from './cookie';
import { ProviderParameterParser } from './custom';
import { ErrorsParameterParser } from './errors';
import { FastifyParameterParser } from './fastify';
import { FileParameterParser } from './file';
import { HeaderParameterParser } from './header';
import { PathParameterParser } from './path';
import { ProviderGenericsParameterParser } from './provider-generics';
import { QueryParameterParser } from './query';
import { ThisParameterParser } from './this';

export function buildParameterParser(
  config: KitaConfig,
  schema: SchemaBuilder,
  collector: AstCollector
): ParameterParser {
  const chain = new ChainParameterParser();

  // Adds custom parsers defined by the user
  config.parameterParserAugmentor?.(chain);

  // Adds default parsers
  chain
    .add(new FastifyParameterParser())
    .add(new QueryParameterParser(schema, config))
    .add(new BodyParameterParser(schema))
    .add(new BodyPropParameterParser(config, schema))
    .add(new ProviderParameterParser(collector))
    .add(new PathParameterParser(schema, config))
    .add(new HeaderParameterParser(config))
    .add(new CookieParameterParser(collector))
    .add(new ThisParameterParser())
    .add(new ProviderGenericsParameterParser())
    .add(new FileParameterParser(config, collector))
    .add(new ErrorsParameterParser(collector));

  return chain;
}
