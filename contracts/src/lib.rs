#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, vec, Address, BytesN, Env, Map, String, Symbol, Vec, I128,
};

#[contracttype]
pub enum DataKey {
    VideoOffering(BytesN<32>), // videoId -> VideoOffering
    Investments(BytesN<32>),   // videoId -> Vec<Investment>
    Revenue(BytesN<32>),       // videoId -> Revenue
}

#[contracttype]
pub struct VideoOffering {
    creator: Address,
    total_shares: i128,
    base_price: i128,
    start_date: u64,
    sale_end_date: u64,
    remaining_shares: i128,
    price_increment: i128,
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
pub struct VideoShareContract;

#[contractimpl]
impl VideoShareContract {
    // Initialize a new video offering
    pub fn create_offering(
        env: Env,
        video_id: BytesN<32>,
        total_shares: i128,
        base_price: i128,
        price_increment: i128,
        sale_duration_days: u32,
    ) -> Result<(), String> {
        let creator = env.invoker();
        let start_date = env.ledger().timestamp();
        let sale_end_date = start_date + (sale_duration_days as u64 * 24 * 60 * 60); // Convert days to seconds

        if total_shares <= 0 || base_price <= 0 || price_increment < 0 {
            return Err(String::from_slice(&env, "Invalid parameters"));
        }

        let offering = VideoOffering {
            creator,
            total_shares,
            base_price,
            start_date,
            sale_end_date,
            remaining_shares: total_shares,
            price_increment,
        };

        env.storage().set(&DataKey::VideoOffering(video_id.clone()), &offering);
        env.storage().set(&DataKey::Investments(video_id.clone()), &Vec::new(&env));
        
        Ok(())
    }

    // Calculate current share price based on time and remaining shares
    fn calculate_share_price(env: &Env, offering: &VideoOffering) -> i128 {
        let current_time = env.ledger().timestamp();
        let time_elapsed = current_time.saturating_sub(offering.start_date);
        let time_factor = time_elapsed / (60 * 60); // Hours elapsed
        
        offering.base_price + (offering.price_increment * time_factor as i128)
    }

    // Buy shares in a video
    pub fn buy_shares(
        env: Env,
        video_id: BytesN<32>,
        shares_to_buy: i128,
    ) -> Result<(), String> {
        if shares_to_buy <= 0 {
            return Err(String::from_slice(&env, "Invalid share amount"));
        }

        let offering: VideoOffering = env.storage().get(&DataKey::VideoOffering(video_id.clone()))
            .ok_or_else(|| String::from_slice(&env, "Offering not found"))?;

        let current_time = env.ledger().timestamp();
        if current_time > offering.sale_end_date {
            return Err(String::from_slice(&env, "Sale has ended"));
        }

        if shares_to_buy > offering.remaining_shares {
            return Err(String::from_slice(&env, "Not enough shares available"));
        }

        let price_per_share = Self::calculate_share_price(&env, &offering);
        let total_cost = price_per_share * shares_to_buy;
        let investor = env.invoker();

        // Record the investment
        let mut investments: Vec<Investment> = env.storage()
            .get(&DataKey::Investments(video_id.clone()))
            .unwrap_or_else(|| Vec::new(&env));

        investments.push_back(Investment {
            investor: investor.clone(),
            shares: shares_to_buy,
            amount_paid: total_cost,
            timestamp: current_time,
        });

        // Update storage
        let new_offering = VideoOffering {
            remaining_shares: offering.remaining_shares - shares_to_buy,
            ..offering
        };

        env.storage().set(&DataKey::VideoOffering(video_id.clone()), &new_offering);
        env.storage().set(&DataKey::Investments(video_id.clone()), &investments);

        Ok(())
    }

    // Deposit revenue for a video
    pub fn deposit_revenue(
        env: Env,
        video_id: BytesN<32>,
        amount: i128,
    ) -> Result<(), String> {
        if amount <= 0 {
            return Err(String::from_slice(&env, "Invalid amount"));
        }

        let offering: VideoOffering = env.storage().get(&DataKey::VideoOffering(video_id.clone()))
            .ok_or_else(|| String::from_slice(&env, "Offering not found"))?;

        // Only creator can deposit revenue
        if env.invoker() != offering.creator {
            return Err(String::from_slice(&env, "Only creator can deposit revenue"));
        }

        let mut revenue: Revenue = env.storage().get(&DataKey::Revenue(video_id.clone()))
            .unwrap_or(Revenue {
                total_amount: 0,
                distributed_amount: 0,
                last_distribution: env.ledger().timestamp(),
            });

        revenue.total_amount += amount;

        env.storage().set(&DataKey::Revenue(video_id), &revenue);

        Ok(())
    }

    // Claim share of revenue
    pub fn claim_revenue(
        env: Env,
        video_id: BytesN<32>,
    ) -> Result<i128, String> {
        let offering: VideoOffering = env.storage().get(&DataKey::VideoOffering(video_id.clone()))
            .ok_or_else(|| String::from_slice(&env, "Offering not found"))?;

        let investments: Vec<Investment> = env.storage().get(&DataKey::Investments(video_id.clone()))
            .ok_or_else(|| String::from_slice(&env, "No investments found"))?;

        let mut revenue: Revenue = env.storage().get(&DataKey::Revenue(video_id.clone()))
            .ok_or_else(|| String::from_slice(&env, "No revenue found"))?;

        let claimant = env.invoker();
        let mut claimant_shares = 0;

        // Calculate claimant's total shares
        for investment in investments.iter() {
            if investment.investor == claimant {
                claimant_shares += investment.shares;
            }
        }

        if claimant_shares == 0 {
            return Err(String::from_slice(&env, "No shares owned"));
        }

        // Calculate unclaimed revenue
        let unclaimed_revenue = revenue.total_amount - revenue.distributed_amount;
        let share_ratio = claimant_shares / offering.total_shares;
        let claimable_amount = (unclaimed_revenue * share_ratio) / 1_000_000; // Apply 6 decimal precision

        if claimable_amount <= 0 {
            return Err(String::from_slice(&env, "No revenue to claim"));
        }

        // Update distributed amount
        revenue.distributed_amount += claimable_amount;
        revenue.last_distribution = env.ledger().timestamp();

        env.storage().set(&DataKey::Revenue(video_id), &revenue);

        Ok(claimable_amount)
    }

    // View functions
    pub fn get_offering(env: Env, video_id: BytesN<32>) -> Option<VideoOffering> {
        env.storage().get(&DataKey::VideoOffering(video_id))
    }

    pub fn get_investments(env: Env, video_id: BytesN<32>) -> Option<Vec<Investment>> {
        env.storage().get(&DataKey::Investments(video_id))
    }

    pub fn get_revenue(env: Env, video_id: BytesN<32>) -> Option<Revenue> {
        env.storage().get(&DataKey::Revenue(video_id))
    }

    pub fn get_current_price(env: Env, video_id: BytesN<32>) -> Result<i128, String> {
        let offering: VideoOffering = env.storage().get(&DataKey::VideoOffering(video_id))
            .ok_or_else(|| String::from_slice(&env, "Offering not found"))?;
        
        Ok(Self::calculate_share_price(&env, &offering))
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::{Address as _, Ledger, LedgerInfo};
    
    #[test]
    fn test_create_offering() {
        let env = Env::default();
        let contract_id = env.register_contract(None, VideoShareContract);
        let client = VideoShareContract::new(&env, &contract_id);

        let video_id = BytesN::from_array(&env, &[1u8; 32]);
        let creator = Address::generate(&env);
        
        env.as_contract(&contract_id, || {
            client.create_offering(
                env.clone(),
                video_id.clone(),
                1000, // total shares
                100,  // base price
                10,   // price increment
                28,   // sale duration in days
            ).unwrap();
        });

        let offering = client.get_offering(env.clone(), video_id).unwrap();
        assert_eq!(offering.total_shares, 1000);
        assert_eq!(offering.base_price, 100);
    }
}
