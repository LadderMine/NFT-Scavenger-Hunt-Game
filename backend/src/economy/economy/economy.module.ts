import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Wallet } from "./entities/wallet.entity"
import { Transaction } from "./entities/transaction.entity"
import { User } from "../users/entities/user.entity"
import { WalletService } from "./services/wallet.service"
import { TransactionService } from "./services/transaction.service"
import { WalletController } from "./controllers/wallet.controller"
import { TransactionController } from "./controllers/transaction.controller"

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Transaction, User])],
  controllers: [WalletController, TransactionController],
  providers: [WalletService, TransactionService],
  exports: [WalletService, TransactionService],
})
export class EconomyModule {}

