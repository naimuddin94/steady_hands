import Ledger from '../modules/Ledger/ledger.model';

const seedingLedger = async () => {
  try {
    // at first check if the admin exist of not
    const ledger = await Ledger.findOne();
    if (!ledger) {
      await Ledger.create({});
    }
  } catch {
    console.log('Error seeding ledger');
  }
};

export default seedingLedger;
