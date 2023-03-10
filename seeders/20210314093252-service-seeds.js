module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('servicetypes', [{
    serviceId: '48ae1527-1c52-4f07-9ab3-8802e4055021',
    description: 'Chain Degreasing &Lubrication',
    cost: 200,
    duration: '01:00:00',
    place: 'WORKSTATION',
    transportCharges: 0,
  },
  {
    serviceId: '98ff7035-b934-444a-a4b8-fb5eb4e8d799',
    description: 'Chain Degreasing &Lubrication',
    cost: 200,
    duration: '01:00:00',
    place: 'ATDOORSTEP',
    transportCharges: 200,
  },
  {
    serviceId: '2f93d0b0-910b-4345-8860-49556da848bc',
    description: 'Bike wash: Pressure washing and drying of bicycle, drivetrain maintenance (chain degreasing, cleaning and lubrication)',
    cost: 300,
    duration: '02:00:00',
    place: 'WORKSTATION',
    transportCharges: 0,
  },
  {
    serviceId: 'eb52479e-4abd-4c8d-aaa0-a841c9a2e6a5',
    description: 'Standard Service: (14 checkpoints, tuning, alignment and drivetrain maintenance)',
    cost: 500,
    duration: '04:00:00',
    place: 'ATDOORSTEP',
    transportCharges: 200,
  },
  {
    serviceId: 'bc8473f2-0a66-4064-b39e-18dddce1f2e9',
    description: 'Standard Service: (14 checkpoints, tuning, alignment and drivetrain maintenance)',
    cost: 500,
    duration: '04:00:00',
    place: 'WORKSTATION',
    transportCharges: 0,
  },
  {
    serviceId: 'cf66de57-9149-47bf-b4d5-e66157e5c90f',
    description: 'Advance Service: (Standard Service + Complete strip down of bike and components & service of each component + Bike wash)',
    cost: 1300,
    duration: '16:00:00',
    place: 'WORKSTATION',
    transportCharges: 0,
  }]),
  down: (queryInterface) => queryInterface.bulkDelete('servicetypes', null, {}),
};
