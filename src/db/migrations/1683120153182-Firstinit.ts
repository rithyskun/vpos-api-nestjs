import { MigrationInterface, QueryRunner } from 'typeorm';

export class Firstinit1683120153182 implements MigrationInterface {
  name = 'Firstinit1683120153182';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "role" ("id" SERIAL NOT NULL, "roleName" character varying NOT NULL, CONSTRAINT "UQ_a6142dcc61f5f3fb2d6899fa264" UNIQUE ("roleName"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying(500) NOT NULL, "lastName" character varying(500) NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "status" boolean NOT NULL, "roles" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "token" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "expired" boolean NOT NULL, "revoked" boolean NOT NULL, "ipAddress" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "token" ADD CONSTRAINT "FK_94f168faad896c0786646fa3d4a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "token" DROP CONSTRAINT "FK_94f168faad896c0786646fa3d4a"`,
    );
    await queryRunner.query(`DROP TABLE "token"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "role"`);
  }
}
