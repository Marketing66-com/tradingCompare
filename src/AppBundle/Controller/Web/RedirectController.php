<?php
/**
 * Created by PhpStorm.
 * User: user
 * Date: 10/22/2018
 * Time: 12:33 PM
 */

namespace AppBundle\Controller\Web;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\BrowserKit\Response;

class RedirectController extends Controller
{

    /**
     * @Route("/Social-Sentiment",name="social_sentiment_old", options={"expose" = true})
     */
    public function social_sentimentAction()
    {
        return $this->redirectToRoute(
            'social_sentiment',[], 301
        );
    }

    /**
     * @Route("/Leaderboard",name="leaderboard_old", options={"expose" = true})
     */
    public function leaderboardAction()
    {
        return $this->redirectToRoute(
            'leaderboard', array("country_name"=>"United States"), 301
        );
    }
    /********************************** BROKERS ***********************************/

    /**
 * @Route("/crypto", name="crypto_old", options={"expose" = true})
 */
    public function crypto_oldAction()
    {
        return $this->redirectToRoute(
            'crypto',[], 301
        );
    }

    /**
     * @Route("/commodities2", name="commodities2_old", options={"expose" = true})
     */
    public function commodities2_oldAction()
    {
        return $this->redirectToRoute(
            'commodities',[], 301
        );
    }

    /**
     * @Route("/commodities", name="commodities_old", options={"expose" = true})
     */
    public function commodities_oldAction()
    {
        return $this->redirectToRoute(
            'commodities',[], 301
        );
    }

    /**
     * @Route("/stock2", name="stock2_old", options={"expose" = true})
     */
    public function stock2_oldAction()
    {
        return $this->redirectToRoute(
            'stock',[], 301
        );
    }


    /********************************** FEEDS ***********************************/

    /**
     * @Route("/stockcurrencies/streaming-stock-rates-majors-social-sentiment/", name="Live_rates_stocks_old", options={"expose" = true})
     */
    public function stock_oldAction()
    {
        return $this->redirectToRoute(
            'Live_rates_stocks', array("country_name"=>"United States", "country_value"=>"united-states-of-america"), 301
        );
    }

    /**
     * @Route("/stockcurrencies/streaming-stock-rates-majors-social-sentiment/{name}/{value}", name="Live_rates_stocks_old2", options={"expose" = true})
     */
    public function StockAction($name, $value)
    {
        return $this->redirectToRoute(
            'Live_rates_stocks', array("name"=>$name, "value"=>$value), 301
        );
    }

    /**
     * @Route("/currencies/streaming-forex-rates-majors-social-sentiment", name="Live_rates_forex_old")
     */
    public function ForexAction()
    {
        return $this->redirectToRoute(
            'Live_rates_forex',[], 301
        );
    }

    /**
     * @Route("/cryptocurrencies/streaming-crypto-rates-majors-social-sentiment", name="Live_rates_crypto_old")
     */
    public function CryptoAction()
    {
        return $this->redirectToRoute(
            'Live_rates_crypto',[], 301
        );
    }
    /********************************** CHARTS ***********************************/

    /**
     * @Route("/currencies/{currency}/chart-real-time-sentiment", name="forex_chart_old", options={"expose" = true})
     */
    public function forex_chart_oldAction($currency)
    {
        $from = substr($currency, 0, 3);
        $to =  substr($currency, 3, 6);
        $pair = $from . "-" . $to;
        return $this->redirectToRoute(
            'forex_chart',array("currency"=>$pair), 301
        );
    }


    /**
     * @Route("/equities/price/{currency}", name="stock_chart_old", options={"expose" = true})
     */
    public function stock_chart_oldAction($currency)
    {
        $client = new \GuzzleHttp\Client();
        try {
            $url = "https://websocket-stock.herokuapp.com/Getstocks/" . $currency;
            $res = $client->request('GET', $url);
            $data = json_decode($res->getBody(), true);

            $new_array = array(' ', '/', '----', '---', '--');
            $data[$currency]['name'] = str_replace('-', " ", $data[$currency]['name']);
            $data[$currency]['name'] = str_replace("'", "", $data[$currency]['name']);
            $data[$currency]['name'] = str_replace($new_array, "-", $data[$currency]['name']);

        } catch (GuzzleException $e) {
            $this->get('logger')->error($e->getMessage());
        }
        return $this->redirectToRoute(
            'stock_chart',array("symbol"=>$currency, 'name'=>$data[$currency]['name']), 301
        );
    }


    /**
     * @Route("/Crypto-currencies/{currency}/real-time-price-sentiment", name="crypto_chart_old", options={"expose" = true})
     */
    public function crypto_chart_oldAction($currency)
    {
        $name_mappings = [
            '8BIT_BTC' => '8BIT Coin', '42_BTC' => '42 Coin', '300_BTC' => '300 token','611_BTC' => 'SixEleven','808_DOGE' => '808','888_BTC' => 'Octocoin','1337_DOGE' => '1337','$$$_BTC' => '$$$','$PAC_USD' => 'PacCoin','ABC_BTC' => 'AB-Chain','ABY_BTC' => 'ArtByte','AC3_BTC' => 'AC3',
            'ACC_BTC' => 'AdCoin','ACOIN_BTC' => 'ACoin','AC_BTC' => 'Asia-Coin','ADA_USD' => 'Cardano','ADC_BTC' => 'AudioCoin','ADST_BTC' => 'Adshares','ADX_BTC' => 'AdEx','AE_BTC' => 'Aeternity','AGA_BTC' => 'AGA','AGI_BTC' => 'SingularityNET','AION_BTC' => 'Aion','ALEX_BTC' => 'Alexandrite',
            'ALIS_BTC' => 'ALISmedia','ALL_BTC' => 'ALL','ALT_BTC' => 'ALTcoin','AMB_BTC' => 'Ambrosus','AMN_BTC' => 'Amon','AMP_BTC' => 'Synereo','ANI_BTC' => 'Animecoin','ANON_BTC' => 'ANON_BTC','APPC_BTC' => 'AppCoins','APX_BTC' => 'Apx','ARCO_BTC' => 'AquariusCoin','ARC_BTC' => 'ArcticCoin',
            'ARDR_BTC' => 'Ardor','ARGUS_BTC' => 'ArgusCoin','ARG_BTC' => 'Argentum','ARI_BTC' => 'BeckSang','ARK_USD' => 'ARK','ARN_BTC' => 'Aeron','AST_BTC' => 'Astral','ATH_BTC' => 'ATH','ATMOS_BTC' => 'Atmos','ATOM_BTC' => 'Cosmos','AUR_BTC' => 'Aurora-Coin','AU_BTC' => 'AU',
            'BAT_BTC' => 'Basic-Attention-Token','BAY_BTC' => 'BitBay','BBT_BTC' => 'BBT_BTC','BCD_BTC' => 'Bitcoin-Diamond','BCF_BTC' => 'BitcoinFast','BCH_USD' => 'Bitcoin-Cash','BCN_BTC' => 'ByteCoin','BCPT_BTC' => 'BlockMason-Credit-Protocol','BCS_BTC' => 'BCS','BDL_BTC' => 'Bitdeal',
            'BEAN_BTC' => 'BEAN','BEEZ_BTC' => 'BEEZ','BENJI_BTC' => 'BenjiRolls','BERN_BTC' => 'BERNcash','BGR_BTC' => 'BGR','BIP_BTC' => 'BipCoin','BIRD_BTC' => 'BIRD','BIS_BTC' => 'Bismuth','BITG_BTC' => 'Bitcoin Green','BITS_BTC' => 'BitstarCoin','BKCAT_BTC' => 'BKCAT',
            'BLC_BTC' => 'BlakeCoin','BLK_BTC' => 'BlackCoin','BLOCK_BTC' => 'BlockNet','BLZ_BTC' => 'Bluzelle','BNB_USD' => 'Binance-Coin','BNC_BTC' => 'Benjacoin','BND_BTC' => 'BND_BTC','BNT_BTC' => 'Bancor-Network-Token','BNX_BTC' => 'BnrtxCoin','BOLI_BTC' => 'BolivarCoin',
            'BON_BTC' => 'Bonpay','BOXX_BTC' => 'BOXX','BPL_BTC' => 'BlockPool','BQX_BTC' => 'BQX','BRD_BTC' => 'Bread-token','BRG_BTC' => 'BRG','BSD_USD' => 'BitSend','BSTY_BTC' => 'GlobalBoost','BTA_BTC' => 'Bata','BTB_BTC' => 'BitBar','BTCS_BTC' => 'Bitcoin Scrypt','BTC_USD' => 'Bitcoin',
            'BTDX_BTC' => 'Bitcloud-2.0','BTG_USD' => 'Bitcoin-Gold','BTS_BTC' => 'Bitshares','BTX_USD' => 'Bitcore','BUBO_BTC' => 'Budbo','BUMBA_BTC' => 'BUMBA','BUN_DOGE' => 'BunnyCoin','BVB_BTC' => 'BVB','BWK_BTC' => 'Bulwark','C2_BTC' => 'Coin.2','CACH_BTC' => 'Cachecoin','CANN_BTC' => 'CannabisCoin',
            'CAN_BTC' => 'CanYaCoin','CAPP_BTC' => 'Cappasity','CAP_BTC' => 'BottleCaps','CAR_BTC' => 'CAR','CAT_BTC' => 'BlockCAT','CBX_BTC' => 'CryptoBullion','CCB_DOGE' => 'CCB','CCN_BTC' => 'CannaCoin','CC_BTC' => 'CyberCoin','CDM_BTC' => 'CDM','CDN_BTC' => 'Canada-eCoin','CDT_BTC' => 'Blox',
            'CEFS_USD' => 'CryptopiaFeeShares','CENNZ_BTC' => 'CENNZ','CFC_BTC' => 'CoffeeCoin','CHAN_BTC' => 'ChanCoin','CHAT_BTC' => 'ChatCoin','CHC_BTC' => 'ChainCoin','CHESS_BTC' => 'ChessCoin','CHIEF_BTC' => 'TheChiefCoin','CJ_BTC' => 'CryptoJacks','CLAM_BTC' => 'CLAMS','CLOAK_BTC' => 'CloakCoin',
            'CL_BTC' => 'CoinLancer','CMPCO_BTC' => 'CampusCoin','CMT_BTC' => 'CyberMiles','CND_BTC' => 'Cindicator','CNET_BTC' => 'CNET_BTC','CNO_BTC' => 'Coino','COAL_BTC' => 'BitCoal','COLX_BTC' => 'ColossusCoinXT','COMP_DOGE' => 'Compound-Coin','CON_BTC' => 'CON','COPPER_BTC' => 'COPPER','COR_BTC' => 'Corion',
            'CPN_BTC' => 'CompuCoin','CQST_BTC' => 'ConquestCoin','CRAVE_BTC' => 'CraveCoin','CRC_BTC' => 'CryCash','CREA_BTC' => 'CreativeChain','CRM_BTC' => 'Cream','CRYPT_BTC' => 'CryptCoin','CTIC3_BTC' => 'CTIC3','CTL_BTC' => 'CTL','CVC_BTC' => 'Civic','CXT_BTC' => 'Coinonat','DALC_BTC' => 'DALC','DAPS_BTC' => 'DAPS_BTC',
            'DARK_BTC' => 'Dark','DASH_USD' => 'Dash','DAS_BTC' => 'DAS','DATA_BTC' => 'Streamr-DATAcoin','DAXX_BTC' => 'DaxxCoin','DBIX_BTC' => 'DubaiCoin','DCN_BTC' => 'Dentacoin','DCR_USD' => 'Decred','DCY_BTC' => 'Dinastycoin','DEM_BTC' => 'eMark','DENT_BTC' => 'Dent','DEUS_BTC' => 'DEUS','DEV_BTC' => 'Deviant-Coin',
            'DGB_USD' => 'DigiByte','DGC_BTC' => 'DigiCoin','DGD_BTC' => 'Digix DAO','DIME_DOGE' => 'DimeCoin','DIM_BTC' => 'DIM_BTC','DIVI_BTC' => 'DIVI_BTC','DIVX_BTC' => 'Divi','DLT_BTC' => 'Agrello-Delta','DNA_BTC' => 'Encrypgen','DNR_BTC' => 'Denarius','DNT_BTC' => 'district0x','DOCK_BTC' => 'DOCK_BTC',
            'DOGE_USD' => 'Dogecoin','DON_BTC' => 'DonationCoin','DOPE_BTC' => 'DopeCoin','DOT_USD' => 'Dotcoin','DPP_BTC' => 'Digital-Assets-Power-Play','DP_BTC' => 'DigitalPrice','DRPU_BTC' => 'DRP-Utility','DRXNE_BTC' => 'Droxne','DUO_BTC' => 'ParallelCoin','DZC_BTC' => 'DZC_BTC','EBG_BTC' => 'EBG','ECA_USD' => 'Electra',
            'ECOB_BTC' => 'EcoBit','EC_BTC' => 'Eclipse','EDC_BTC' => 'EducoinV','EDDIE_DOGE' => 'Eddie-coin','EDO_BTC' => 'Eidoo','EDRC_BTC' => 'EDRCoin','EFL_BTC' => 'E-Gulden','EGC_BTC' => 'EverGreenCoin','ELC_BTC' => 'Elacoin','ELF_BTC' => 'aelf','ELLA_BTC' => 'Ellaism','ELM_BTC' => 'Elements','EMB_DOGE' => 'EmberCoin',
            'EMC2_BTC' => 'Einsteinium','EMC_BTC' => 'Emercoin','EMD_BTC' => 'Emerald','ENG_BTC' => 'Enigma','ENJ_BTC' => 'Enjin-Coin','EOS_USD' => 'EOS','EPC_DOGE' => 'EPC','EQT_BTC' => 'EquiTrader','ERY_BTC' => 'Eryllium','ETC_USD' => 'Ethereum-Classic','ETHD_BTC' => 'Ethereum-Dark','ETH_USD' => 'Ethereum','ETN_USD' => 'Electroneum',
            'ETT_BTC' => 'EncryptoTel','ETZ_BTC' => 'EtherZero','EVIL_BTC' => 'EvilCoin','EVO_BTC' => 'EVO','EVR_BTC' => 'Everus','EVX_BTC' => 'Everex','EXP_BTC' => 'Expanse','EZT_USD' => 'EZToken','FANS_BTC' => 'FANS','FC2_BTC' => 'Fuel2Coin','FCT_BTC' => 'Factoids','FFC_BTC' => 'FireflyCoin','FGC_BTC' => 'FGC_BTC','FJC_BTC' => 'FujiCoin',
            'FLASH_BTC' => 'FLASH-coin','FLAX_BTC' => 'FLAX','FLN_DOGE' => 'FLN','FLT_BTC' => 'FlutterCoin','FONZ_BTC' => 'FonzieCoin','FRN_BTC' => 'Francs','FROST_BTC' => 'FROST','FST_BTC' => 'FastCoin','FTCC_BTC' => 'FTCC','FTC_BTC' => 'FeatherCoin','FTEC_BTC' => 'FTEC_BTC','FT_BTC' => 'Fabric-Token','FUEL_BTC' => 'Etherparty',
            'FUNK_DOGE' => 'Cypherfunks-Coin','FUN_BTC' => 'FunFair','FUZZ_BTC' => 'Fuzzballs','GAME_BTC' => 'Gamecredits','GAP_BTC' => 'Gapcoin','GAS_BTC' => 'Gas','GBX_USD' => 'GoByte','GBYTE_BTC' => 'Byteball','GCC_BTC' => 'TheGCCcoin','GCN_DOGE' => 'gCn-Coin','GDC_BTC' => 'GrandCoin','GEERT_BTC' => 'GEERT',
            'GEO_BTC' => 'GeoCoin','GIN_BTC' => 'GINcoin','GLD_BTC' => 'GoldCoin','GNO_BTC' => 'Gnosis','GNR_BTC' => 'Gainer','GNT_BTC' => 'Golem-Network-Token','GO_BTC' => 'GO_BTC','GPL_BTC' => 'Gold-Pressed-Latinum','GP_BTC' => 'GoldPieces','GRFT_BTC' => 'Graft-Blockchain','GRN_BTC' => 'GRN','GRS_BTC' => 'Groestlcoin ',
            'GRWI_BTC' => 'Growers-International','GRW_BTC' => 'GrowthCoin','GTM_BTC' => 'GTM_BTC','GTO_BTC' => 'GIFTO','GUN_BTC' => 'GunCoin','GVT_BTC' => 'Genesis-Vision','GXG_BTC' => 'GXG','GXS_BTC' => 'GXChain','GZE_BTC' => 'GZE','HAC_BTC' => 'Hackspace-Capital','HAL_BTC' => 'Halcyon','HAV_BTC' => 'Havven','HBN_BTC' => 'HoboNickels',
            'HC_BTC' => 'HC','HDLB_BTC' => 'HDLB','HEAT_BTC' => 'Heat-Ledger','HLM_BTC' => 'HLM','HOT_BTC' => 'HOT_BTC','HSR_BTC' => 'Hshare','HST_BTC' => 'Decision-Token','HUSH_USD' => 'Hush','HUZU_BTC' => 'HUZU_BTC','HXX_BTC' => 'HexxCoin','HYP_BTC' => 'Hyperstake','I0C_BTC' => 'I0coin','ICN_BTC' => 'Iconomi','ICX_USD' => 'ICON-Project',
            'IC_BTC' => 'Ignition','IDH_BTC' => 'IndaHash','IFLT_DOGE' => 'InflationCoin','IFT_BTC' => 'InvestFeed','INFX_BTC' => 'Influxcoin','INN_BTC' => 'Innova','INSN_BTC' => 'Insane-Coin','INS_BTC' => 'INS-Ecosystem','IN_BTC' => 'InCoin','IOST_BTC' => 'IOS-token','IOTA_USD' => 'IOTA','IOTX_BTC' => 'IoTeX-Network',
            'IQT_BTC' => 'IQT','IQ_BTC' => 'IQ','IRL_BTC' => 'IrishCoin','TI_BTC' => 'ITI','IVY_BTC' => 'IvyKoin','IXC_BTC' => 'IXcoin','KASH_BTC' => 'KASH','KBR_BTC' => 'Kubera-Coin','KDC_BTC' => 'Klondike-Coin','KED_BTC' => 'Klingon-Empire-Darsek','KEK_BTC' => 'KekCoin','KEY_BTC' => 'SelfKey','KING_BTC' => 'King93','KMD_BTC' => 'Komodo',
            'KNC_BTC' => 'Kyber-Network','KOBO_BTC' => 'KoboCoin','KRB_BTC' => 'Karbo','KRONE_BTC' => 'Kronecoin','KUMA_BTC' => 'KUMA','KUSH_BTC' => 'KushCoin', 'LANA_BTC' => 'LanaCoin','LBC_BTC' => 'LBRY-Credits','LBTC_BTC' => 'LiteBitcoin','LCP_BTC' => 'Litecoin-Plus','LDC_BTC' => 'LeadCoin','LDOGE_BTC' => 'LiteDoge',
            'LEAF_DOGE' => 'LeafCoin','LEA_BTC' => 'LeaCoin','LEMON_BTC' => 'LemonCoin','LEND_BTC' => 'EthLend','LGS_USD' => 'LGS_USD','LINA_BTC' => 'LINA','LINDA_BTC' => 'Linda','LINK_BTC' => 'ChainLink','LINX_BTC' => 'Linx','LIT_BTC' => 'LIT','LIVE_BTC' => 'Live-Stars','LOKI_BTC' => 'Loki','LOOK_BTC' => 'LookCoin','LOOM_BTC' => 'Loom-Network',
            'LOT_DOGE' => 'LottoCoin','LPC_USD' => 'LPC_USD','LRC_BTC' => 'Loopring','LSK_BTC' => 'Lisk','LTB_BTC' => 'Litebar','LTCU_BTC' => 'LiteCoin-Ultra','LTC_USD' => 'Litecoin','LUN_BTC' => 'Lunyr','LUX_USD' => 'Luxmi-Coin','LWF_BTC' => 'Local-World-Forwarders','LYC_DOGE' => 'LycanCoin','LYL_USD' => 'LYL',
            'LYNX_DOGE' => 'Lynx','MAC_BTC' => 'MachineCoin','MAGE_BTC' => 'MAGE','MAGN_BTC' => 'MAGN','MAG_BTC' => 'Magos','MAID_BTC' => 'MaidSafe-Coin','MANA_BTC' => 'Decentraland','MARKS_BTC' => 'MARKS','MARS_BTC' => 'MarsCoin','MARX_BTC' => 'MarxCoin','MAR_BTC' => 'MarijuanaCoin','MATRX_BTC' => 'MATRX','MAZA_BTC' => 'MAZA','MBRS_BTC' => 'Embers',
            'MCI_BTC' => 'Musiconomi','MCO_BTC' => 'Monaco','MDA_BTC' => 'Moeda','MEC_BTC' => 'MegaCoin','MFT_BTC' => 'MFT','MGO_BTC' => 'MobileGo','MGX_BTC' => 'MGX','MINEX_BTC' => 'Minex','MINT_BTC' => 'MintCoin','MNE_BTC' => 'Minereum','MOD_BTC' => 'Modum','MOIN_BTC' => 'MoinCoin','MOJO_BTC' => 'Mojocoin','MONK_USD' => 'Monkey-Project',
            'MOTO_BTC' => 'Motocoin','MRI_BTC' => 'MRI_BTC','MSP_BTC' => 'Mothership','MSR_BTC' => 'MSR_BTC','MST_BTC' => 'MustangCoin','MTH_BTC' => 'Monetha','MTL_BTC' => 'Metal','MTNC_BTC' => 'MTNC','MUSIC_BTC' => 'Musicoin','NAMO_BTC' => 'NamoCoin','NANO_BTC' => 'Nano','NAS_BTC' => 'Nebulas','NAV_USD' => 'NavCoin',
            'NCASH_BTC' => 'Nucleus-Vision','NEBL_BTC' => 'Neblio','NEO_USD' => 'NEO','NETKO_BTC' => 'Netko','NET_BTC' => 'Nimiq-Exchange-Token','NEVA_BTC' => 'NevaCoin','NKA_DOGE' => 'IncaKoin','NLC2_BTC' => 'NoLimitCoin','NLX_BTC' => 'Nullex','NMC_BTC' => 'Namecoin','NMS_BTC' => 'Numus','NOBL_BTC' => 'NobleCoin','NOR_BTC' => 'NOR_BTC',
            'NPW_BTC' => 'NPW','NPXS_BTC' => 'Pundi-X','NRG_BTC' => 'NRG','NTRN_BTC' => 'Neutron','NULS_USD' => 'Nuls','NVC_BTC' => 'NovaCoin','NXS_BTC' => 'Nexus','NYAN_BTC' => 'NyanCoin','NZDT_USD' => 'NZDT','OAX_BTC' => 'OpenANX','ODN_BTC' => 'Obsidian','OFF_BTC' => 'OFF','OK_BTC' => 'OKCash','OMG_BTC' => 'OmiseGo','ONION_BTC' => 'DeepOnion',
            'ONT_USD' => 'Ontology','OOO_BTC' => 'OOO','OPAL_BTC' => 'OpalCoin','OPCX_BTC' => 'OPCX','OPC_BTC' => 'OP-Coin','ORB_BTC' => 'Orbitcoin','ORE_BTC' => 'Galactrum','ORME_USD' => 'Ormeus-Coin','OSC_BTC' => 'OpenSourceCoin','OST_BTC' => 'Simple-Token','OTN_BTC' => 'Open-Trading-Network','OXY_BTC' => 'Oxycoin','OZC_BTC' => 'OZC','PAK_BTC' => 'Pakcoin',
            'PASL_BTC' => 'Pascal-Lite','PASS_BTC' => 'PASS_BTC','PAX_USD' => 'PAX_USD','PAY_BTC' => 'TenX','PBL_BTC' => 'Publica','PCC_BTC' => 'PCC','PCN_DOGE' => 'PeepCoin','PCOIN_BTC' => 'Pioneer-Coin','PENG_BTC' => 'PENG','PEPE_BTC' => 'PEPE','PF_BTC' => 'PROVER','PHO_DOGE' => 'Photon','PHR_BTC' => 'Phreak','PHS_BTC' => 'PhilosophersStone','PHX_BTC' => 'PHX_BTC',
            'PIGGY_BTC' => 'Piggy-Coin','PINK_BTC' => 'PinkCoin','PIRL_BTC' => 'Pirl','PIVX_BTC' => 'Private-Instant-Verified-Transaction','PLC_BTC' => 'PlusCoin','PLR_BTC' => 'Pillar','PND_BTC' => 'PandaCoin','POA_BTC' => 'Poa-Network','POE_BTC' => 'Po.et','POLIS_BTC' => 'PolisPay','POLL_BTC' => 'ClearPoll','POLY_BTC' => 'POLY_BTC','POP_BTC' => 'PopularCoin','POST_BTC' => 'PostCoin','POT_BTC' => 'PotCoin','POWR_BTC' => 'Power-Ledger','PPC_BTC' => 'PeerCoin','PPT_BTC' => 'Populous','PRJ_BTC' => 'PRJ_BTC','PRL_BTC' => 'Oyster-Pearl','PROC_BTC' => 'ProCurrency','PROUD_BTC' => 'PROUD-Money','PR_BTC' => 'PR','PTC_BTC' => 'Propthereum','PURA_BTC' => 'Pura','PUT_BTC' => 'Robin8-Profile-Utility-Token','PXC_BTC' => 'PhoenixCoin','PXI_BTC' => 'Prime-X1','Q2C_BTC' => 'QubitCoin','QAC_BTC' => 'QAC','QBT_BTC' => 'Qbao','QKC_BTC' => 'QuarkChain','QLC_BTC' => 'QLC-Chain','QNTU_BTC' => 'QNTU_BTC','QRK_BTC' => 'QuarkCoin','QSP_BTC' => 'Quantstamp','QTL_BTC' => 'Quatloo','QTUM_USD' => 'QTUM','QWARK_BTC' => 'Qwark','RAIN_BTC' => 'Condensate','RBBT_DOGE' => 'RBBT','RBT_BTC' => 'Rimbit','RBY_BTC' => 'RubyCoin','RCN_BTC' => 'Ripio','RC_BTC' => 'Russiacoin','RDD_BTC' => 'Reddcoin','RDN_BTC' => 'Raiden-Network','RED_BTC' => 'Redcoin','REP_BTC' => 'Augur','REQ_BTC' => 'Request-Network','RICKS_BTC' => 'RICKS','RIYA_BTC' => 'Etheriya','RKC_BTC' => 'Royal-Kingdom-Coin','RLC_BTC' => 'iEx.ec','RNS_BTC' => 'RenosCoin','RPC_BTC' => 'RonPaulCoin','RPX_BTC' => 'Red-Pulse','RRT_USD' => 'Recovery-Right-Tokens','RVN_BTC' => 'RVN_BTC','RYO_BTC' => 'RYO','R_BTC' => 'Revain','SAGA_BTC' => 'SagaCoin','SALT_BTC' => 'Salt-Lending','SAND_BTC' => 'BeachCoin','SCL_BTC' => 'Sociall','SCT_BTC' => 'Soma','SC_BTC' => 'Siacoin','SDRN_BTC' => 'Sanderon','SEL_BTC' => 'SelenCoin','SEND_BTC' => 'Social-Send','SFC_BTC' => 'Solarflarecoin','SHARD_BTC' => 'SHARD_BTC','SHA_BTC' => 'Shacoin','SHRM_BTC' => 'SHRM','SHVR_BTC' => 'SHVR','SIB_BTC' => 'SibCoin','SIRX_BTC' => 'SIRX','SJW_BTC' => 'SJW','SKC_BTC' => 'Skeincoin','SKIN_BTC' => 'Skincoin','SKRL_BTC' => 'SKRL','SKR_BTC' => 'Skrilla-Token','SKY_USD' => 'Skycoin','SLG_BTC' => 'SterlingCoin','SLOTH_DOGE' => 'SLOTH','SMART_BTC' => 'SmartCash','SMC_BTC' => 'SmartCoin','SNGLS_BTC' => 'SingularDTV','SNM_BTC' => 'SONM','SNT_BTC' => 'Status-Network-Token','SOIL_BTC' => 'SoilCoin','SONG_BTC' => 'Song-Coin','SONIQ_BTC' => 'SONIQ_BTC','SOON_BTC' => 'SoonCoin','SPACE_BTC' => 'SpaceCoin','SPANK_BTC' => 'SpankChain','SPN_DOGE' => 'Spoon','SPR_BTC' => 'Spreadcoin','SPT_BTC' => 'Spots','SQL_BTC' => 'Squall-Coin','SRC_BTC' => 'SwissRealCoin','SRN_BTC' => 'SirinLabs','START_BTC' => 'StartCoin','STEEM_BTC' => 'Steem','STN_BTC' => 'Steneum-Coin','STORJ_BTC' => 'Storj','STORM_BTC' => 'Storm','STRAT_BTC' => 'Stratis','STRC_BTC' => 'STRC','STV_BTC' => 'Sativa-Coin','SUB_BTC' => 'Substratum-Network','SUMO_BTC' => 'Sumokoin','SWING_BTC' => 'SwingCoin','SXC_BTC' => 'SexCoin','SYNX_BTC' => 'Syndicate','SYS_BTC' => 'SysCoin','TAJ_BTC' => 'TajCoin','TEK_BTC' => 'TekCoin','TER_BTC' => 'TerraNovaCoin','TES_BTC' => 'TeslaCoin','TGC_BTC' => 'TigerCoin','THETA_BTC' => 'Theta','TIT_BTC' => 'TitCoin','TIX_BTC' => 'Blocktix','TNB_BTC' => 'Time-New-Bank','TNT_BTC' => 'Tierion','TOA_BTC' => 'TOA-Coin','TOK_BTC' => 'TokugawaCoin','TOP_BTC' => 'TOP','TPAY_BTC' => 'TrollPlay','TRBO_BTC' => 'TRBO','TRC_BTC' => 'TerraCoin','TRIG_BTC' => 'Trigger','TRI_BTC' => 'Triangles-Coin','TRK_BTC' => 'TruckCoin','TRUMP_BTC' => 'TrumpCoin','TRX_USD' => 'Tronix','TTC_BTC' => 'TittieCoin','TTY_BTC' => 'TTY','TUSD_USD' => 'True USD','TWIST_BTC' => 'TwisterCoin','TX_BTC' => 'Transfer','TZC_BTC' => 'TrezarCoin','UBQ_BTC' => 'Ubiq','UBT_BTC' => 'UBT_BTC','UFR_BTC' => 'Upfiring','UIS_BTC' => 'Unitus','UMO_BTC' => 'UMO','UNIC_BTC' => 'UNIC','UNIFY_BTC' => 'Unify','UNIT_BTC' => 'Universal-Currency','UNO_USD' => 'Unobtanium','USDC_BTC' => 'USDC_BTC','USDT_BTC' => 'Tether','UTC_BTC' => 'UltraCoin','VADE_DOGE' => 'VADE','VCC_BTC' => 'VCC','VEN_USD' => 'Vechain','VET_USD' => 'VET_USD','VIA_BTC' => 'ViaCoin','VIBE_BTC' => 'VIBEHub','VIB_BTC' => 'Viberate','VITAE_BTC' => 'VITAE','VIT_BTC' => 'Vice-Industry-Token','VIVO_BTC' => 'VIVO-Coin','VOISE_BTC' => 'Voise','VPRC_DOGE' => 'VapersCoin','VRC_BTC' => 'VeriCoin','VRM_BTC' => 'Verium','V_BTC' => 'V','WABI_BTC' => 'WaBi','WAN_BTC' => 'Wanchain','WAVES_BTC' => 'Waves','WC_BTC' => 'WhiteCoin','WDC_BTC' => 'WorldCoin','WEED_BTC' => 'WEED','WHL_BTC' => 'WhaleCoin','WILD_BTC' => 'Wild Crypto','WINGS_BTC' => 'Wings DAO','WISH_BTC' => 'WishFinance','WLC_BTC' => 'WLC','WPR_BTC' => 'WePower','WRC_BTC' => 'Worldcore','WSP_BTC' => 'WSP','WSX_BTC' => 'WeAreSatoshi','WTC_BTC' => 'Waltonchain','WW_BTC' => 'WW','XBC_BTC' => 'BitcoinPlus','XBL_BTC' => 'Billionaire-Token','XBP_BTC' => 'BlitzPredict','XBY_BTC' => 'XtraBYtes','XCASH_BTC' => 'XCASH_BTC','XCO_BTC' => 'XCoin','XCT_BTC' => 'C-Bits','XCXT_BTC' => 'CoinonatX','XDNA_BTC' => 'XDNA_BTC','XEM_BTC' => 'NEM','XGOX_BTC' => 'XGOX','XID_BTC' => 'Sphre-AIR','XJO_BTC' => 'JouleCoin','XLC_BTC' => 'LeviarCoin','XLM_USD' => 'Stellar','XMCC_BTC' => 'Monoeci','XMG_BTC' => 'Coin Magi','XMR_USD' => 'Monero','XMY_BTC' => 'MyriadCoin','XPD_BTC' => 'PetroDollar','XPM_BTC' => 'PrimeCoin','XPTX_BTC' => 'PlatinumBAR','XP_DOGE' => 'Experience-Points','XRA_BTC' => 'Ratecoin','XRE_BTC' => 'RevolverCoin','XRP_USD' => 'Ripple','XRY_BTC' => 'XRY','XSN_BTC' => 'XSN','XSPEC_BTC' => 'Spectre','XST_BTC' => 'StealthCoin','XVG_USD' => 'Verge','XWC_BTC' => 'WhiteCoin','XXX_BTC' => 'XXXCoin','XZC_BTC' => 'ZCoin','XZX_BTC' => 'XZX','YOVI_BTC' => 'YobitVirtualCoin','YOYO_BTC' => 'YOYO','ZAP_BTC' => 'Zap','ZCL_BTC' => 'ZClassic','ZEC_USD' => 'ZCash','ZEIT_DOGE' => 'ZeitCoin','ZEN_BTC' => 'ZenCash','ZER_BTC' => 'Zero','ZEST_BTC' => 'ZEST','ZET_BTC' => 'ZetaCoin','ZIL_BTC' => 'Zilliqa','ZNY_BTC' => 'BitZeny','ZRX_BTC' => '0x','ZSE_BTC' => 'ZSEcoin'

        ];

        return $this->redirectToRoute(
            'crypto_chart',array('name' => $name_mappings[$currency], 'currency' => $currency), 301
        );
    }



}
