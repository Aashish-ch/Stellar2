#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, vec, Address, BytesN, Env, Map, String, Symbol, Vec, I128,
};

#[contracttype]
pub enum DataKey {
    StreamOffering(BytesN<32>), // streamId -> StreamOffering
    Investments(BytesN<32>),    // streamId -> Vec<Investment>
    Revenue(BytesN<32>),        // streamId -> Revenue
}

#[contracttype]
pub struct StreamOffering {
    creator: Address,
    total_shares: i128,
    base_price: i128,
    pre_live_start: u64,   // When pre-live investing starts
    stream_start: u64,     // When the stream actually starts
    remaining_shares: i128,
    max_price: i128,       // Maximum price during pre-live period
}

#[contracttype]
pub struct Investment {
    investor: Address,
    shares: i128,
    amount_paid: i128,
    timestamp: u64,
}

#[contracttype]
pub struct Revenue {
    total_amount: i128,
    distributed_amount: i128,
    last_distribution: u64,
}

#[contract]
pub struct LiveStreamContract;

#[contractimpl]
impl LiveStreamContract {
    // Initialize a new stream offering
    pub fn create_stream_offering(
        env: Env,
        stream_id: BytesN<32>,
        total_shares: i128,
        base_price: i128,
        max_price: i128,
        pre_live_duration_hours: u32,
        stream_start_timestamp: u64,
    ) -> Result<(), String> {
        let creator = env.invoker();
        let current_time = env.ledger().timestamp();
        
        // Calculate pre-live start time
        let pre_live_start = stream_start_timestamp - (pre_live_duration_hours as u64 * 60 * 60);
        
        if total_shares <= 0 || base_price <= 0 || max_price <= base_price {
            return Err(String::from_slice(&env, "Invalid parameters"));
        }

        if pre_live_start <= current_time {
            return Err(String::from_slice(&env, "Pre-live period must be in the future"));
        }

        let offering = StreamOffering {
            creator,
            total_shares,
            base_price,
            pre_live_start,
            stream_start: stream_start_timestamp,
            remaining_shares: total_shares,
            max_price,
        };

        env.storage().set(&DataKey::StreamOffering(stream_id.clone()), &offering);
        env.storage().set(&DataKey::Investments(stream_id.clone()), &Vec::new(&env));
        env.storage().set(&DataKey::Revenue(stream_id.clone()), &Revenue {
            total_amount: 0,
            distributed_amount: 0,
            last_distribution: current_time,
        });
        
        Ok(())
    }

    // Calculate current share price based on time until stream start
    fn calculate_share_price(env: &Env, offering: &StreamOffering) -> i128 {
        let current_time = env.ledger().timestamp();
        
        // Not started pre-live period yet
        if current_time < offering.pre_live_start {
            return offering.base_price;
        }
        
        // Stream has started
        if current_time >= offering.stream_start {
            return offering.max_price;
        }
        
        // During pre-live period - price increases linearly
        let total_pre_live_duration = offering.stream_start - offering.pre_live_start;
        let time_elapsed = current_time - offering.pre_live_start;
        let progress_ratio = (time_elapsed as f64) / (total_pre_live_duration as f64);
        
        let price_range = offering.max_price - offering.base_price;
        offering.base_price + (price_range as f64 * progress_ratio) as i128
    }

    // Buy shares in a stream
    pub fn buy_shares(
        env: Env,
        stream_id: BytesN<32>,
        shares_to_buy: i128,
    ) -> Result<(), String> {
        if shares_to_buy <= 0 {
            return Err(String::from_slice(&env, "Invalid share amount"));
        }

        let offering: StreamOffering = env.storage().get(&DataKey::StreamOffering(stream_id.clone()))
            .ok_or_else(|| String::from_slice(&env, "Offering not found"))?;

        let current_time = env.ledger().timestamp();
        
        // Cannot buy after stream starts
        if current_time >= offering.stream_start {
            return Err(String::from_slice(&env, "Stream has started, no more shares available"));
        }

        if shares_to_buy > offering.remaining_shares {
            return Err(String::from_slice(&env, "Not enough shares available"));
        }

        let price_per_share = Self::calculate_share_price(&env, &offering);
        let total_cost = price_per_share * shares_to_buy;
        let investor = env.invoker();

        // Record the investment
        let mut investments: Vec<Investment> = env.storage()
            .get(&DataKey::Investments(stream_id.clone()))
            .unwrap_or_else(|| Vec::new(&env));

        investments.push_back(Investment {
            investor: investor.clone(),
            shares: shares_to_buy,
            amount_paid: total_cost,
            timestamp: current_time,
        });

        // Update storage
        let new_offering = StreamOffering {
            remaining_shares: offering.remaining_shares - shares_to_buy,
            ..offering
        };

        env.storage().set(&DataKey::StreamOffering(stream_id.clone()), &new_offering);
        env.storage().set(&DataKey::Investments(stream_id.clone()), &investments);

        Ok(())
    }

    // Deposit revenue for a stream
    pub fn deposit_revenue(
        env: Env,
        stream_id: BytesN<32>,
        amount: i128,
    ) -> Result<(), String> {
        if amount <= 0 {
            return Err(String::from_slice(&env, "Invalid amount"));
        }

        let offering: StreamOffering = env.storage().get(&DataKey::StreamOffering(stream_id.clone()))
            .ok_or_else(|| String::from_slice(&env, "Offering not found"))?;

        // Only creator can deposit revenue
        if env.invoker() != offering.creator {
            return Err(String::from_slice(&env, "Only creator can deposit revenue"));
        }

        let mut revenue: Revenue = env.storage().get(&DataKey::Revenue(stream_id.clone()))
            .ok_or_else(|| String::from_slice(&env, "Revenue not found"))?;

        revenue.total_amount += amount;
        env.storage().set(&DataKey::Revenue(stream_id), &revenue);

        Ok(())
    }

    // View functions
    pub fn get_offering(env: Env, stream_id: BytesN<32>) -> Option<StreamOffering> {
        env.storage().get(&DataKey::StreamOffering(stream_id))
    }

    pub fn get_investments(env: Env, stream_id: BytesN<32>) -> Option<Vec<Investment>> {
        env.storage().get(&DataKey::Investments(stream_id))
    }

    pub fn get_current_price(env: Env, stream_id: BytesN<32>) -> Result<i128, String> {
        let offering: StreamOffering = env.storage().get(&DataKey::StreamOffering(stream_id))
            .ok_or_else(|| String::from_slice(&env, "Offering not found"))?;
        
        Ok(Self::calculate_share_price(&env, &offering))
    }

    pub fn get_stream_status(env: Env, stream_id: BytesN<32>) -> Result<String, String> {
        let offering: StreamOffering = env.storage().get(&DataKey::StreamOffering(stream_id))
            .ok_or_else(|| String::from_slice(&env, "Offering not found"))?;
        
        let current_time = env.ledger().timestamp();
        
        if current_time < offering.pre_live_start {
            Ok(String::from_slice(&env, "UPCOMING"))
        } else if current_time < offering.stream_start {
            Ok(String::from_slice(&env, "PRE_LIVE"))
        } else {
            Ok(String::from_slice(&env, "LIVE"))
        }
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::{Address as _, Ledger, LedgerInfo};
    
    #[test]
    fn test_create_stream() {
        let env = Env::default();
        let contract_id = env.register_contract(None, LiveStreamContract);
        let client = LiveStreamContract::new(&env, &contract_id);

        let stream_id = BytesN::from_array(&env, &[1u8; 32]);
        let creator = Address::generate(&env);
        let current_time = env.ledger().timestamp();
        let stream_start = current_time + 24 * 60 * 60; // 24 hours from now
        
        env.as_contract(&contract_id, || {
            client.create_stream_offering(
                env.clone(),
                stream_id.clone(),
                1000,  // total shares
                100,   // base price
                1000,  // max price
                12,    // pre-live duration hours
                stream_start,
            ).unwrap();
        });

        let offering = client.get_offering(env.clone(), stream_id).unwrap();
        assert_eq!(offering.total_shares, 1000);
        assert_eq!(offering.base_price, 100);
        assert_eq!(offering.max_price, 1000);
    }
}
