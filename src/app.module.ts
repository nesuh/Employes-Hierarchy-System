import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Position } from './all_position_part/position.entity';
// import { PositionsController } from './all_position_part/positions.controller';
// import { PositionsService } from './all_position_part/positions.service';
import { PositionModule } from './all_position_part/position.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '1213A',
        database: 'organization',
        entities: [Position],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    PositionModule,
  ],
  
})

export class AppModule {}
