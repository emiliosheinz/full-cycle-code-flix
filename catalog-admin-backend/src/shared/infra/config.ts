import { config as readEnv } from 'dotenv';
import { join as joinPath } from 'node:path';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class Config {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	static env: any = null;

	static db() {
		Config.readEnv();

		return {
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			dialect: 'sqlite' as any,
			host: Config.env.DB_HOST,
			logging: Config.env.DB_LOGGING === 'true',
		};
	}

	static readEnv() {
		if (Config.env) {
			return;
		}

    const envFromFile = readEnv({
			path: joinPath(
				__dirname,
				`../../../envs/.env.${process.env.NODE_ENV}`,
			),
		})

    if(envFromFile.error) {
      throw envFromFile.error
    }

		Config.env = envFromFile.parsed;
	}
}
