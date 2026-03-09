import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';
import { ErrorFilter } from './filters/error.filter';
import { SupabaseService } from './services/supabase.service';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./environments/.env.${process.env.NODE_ENV}`,
      // process.env.NODE_ENV === 'production'
      //   ? '.env.production'
      //   : process.env.NODE_ENV === 'staging'
      //     ? '.env.staging'
      //     : process.env.NODE_ENV === 'development'
      //       ? '.env.development'
      //       : '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
        logging:
          configService.get('NODE_ENV') !== 'production'
            ? 'all'
            : ['warn', 'error'],
        logger: 'advanced-console',
      }),
    }),
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          namespace: 'cache',
          ttl: 3600,
          stores: [new KeyvRedis(configService.get<string>('CACHE_URL'))],
        };
      },
    }),
  ],
  providers: [
    SupabaseService,
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
  ],

  exports: [SupabaseService],
})
export class CommonModule {}
